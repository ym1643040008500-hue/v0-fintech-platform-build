"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/firebase-client"
import { doc, onSnapshot } from "firebase/firestore"

export function useWallet(userId: string) {
  const [wallet, setWallet] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    const walletRef = doc(db, "wallets", userId)
    const unsubscribe = onSnapshot(walletRef, (snapshot) => {
      setWallet(snapshot.data())
      setLoading(false)
    })

    return () => unsubscribe()
  }, [userId])

  return { wallet, loading }
}
