"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { auth, db } from "./firebase"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"

interface UserProfile {
  uid: string
  email?: string
  balance?: number
}

interface AuthContextType {
  user: any
  userProfile: UserProfile | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        const userRef = doc(db, "users", firebaseUser.uid)
        const snap = await getDoc(userRef)
        if (snap.exists()) {
          const data = snap.data()
          setUserProfile({ uid: firebaseUser.uid, ...data } as UserProfile)
        } else {
          setUserProfile({ uid: firebaseUser.uid })
        }
      } else {
        setUserProfile(null)
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, userProfile, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
