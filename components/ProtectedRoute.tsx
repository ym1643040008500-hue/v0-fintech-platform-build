"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { ReactNode, useEffect } from "react"

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user === null) {
      router.push("/login") // لو مش مسجل → يروح لصفحة تسجيل الدخول
    }
  }, [user, router])

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-200">
        جاري التحقق من تسجيل الدخول...
      </div>
    )
  }

  return <>{children}</>
}
