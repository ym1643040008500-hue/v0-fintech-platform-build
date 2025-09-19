"use client"

import { useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { AdminDashboardStats } from "@/components/admin/admin-dashboard-stats"
import { TransactionMonitoring } from "@/components/admin/transaction-monitoring"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, TrendingUp, Users, Shield } from "lucide-react"

export default function AdminDashboardPage() {
  const { user, loading, profile } = useAuth() // profile جاي من Firestore
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth/login") // مش عامل تسجيل دخول
      } else if (!profile?.isAdmin) {
        router.push("/dashboard") // مش أدمن
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
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor and manage your fintech platform
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="destructive" className="bg-orange-500">
              <AlertTriangle className="h-3 w-3 mr-1" />
              8 Alerts
            </Badge>
            <Badge variant="secondary">
              <Shield className="h-3 w-3 mr-1" />
              12 KYC Pending
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <AdminDashboardStats />

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High-Risk Transactions</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">3</div>
              <p className="text-xs text-muted-foreground">
                Require immediate attention
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New User Registrations</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">47</div>
              <p className="text-xs text-muted-foreground">In the last 24 hours</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platform Growth</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">+12.5%</div>
              <p className="text-xs text-muted-foreground">Monthly active users</p>
            </CardContent>
          </Card>
        </div>

        {/* Transaction Monitoring */}
        <TransactionMonitoring />
      </div>
    </AdminLayout>
  )
}
