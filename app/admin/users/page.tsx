"use client"

import { useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { UserManagementTable } from "@/components/admin/user-management-table"

export default function AdminUsersPage() {
  const { user, loading, profile } = useAuth() // profile = بيانات Firestore للمستخدم
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // مش عامل تسجيل دخول
        router.push("/auth/login")
      } else if (!profile?.isAdmin) {
        // مش أدمن → رجعه على الداشبورد
        router.push("/dashboard")
      }
    }
  }, [user, loading, profile, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user || !profile?.isAdmin) {
    return null
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts, KYC status, and permissions
          </p>
        </div>
        <UserManagementTable />
      </div>
    </AdminLayout>
  )
}
