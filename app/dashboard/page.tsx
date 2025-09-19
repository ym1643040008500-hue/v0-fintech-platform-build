"use client"

import { useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { QuickStats } from "@/components/dashboard/quick-stats"
import { PortfolioChart } from "@/components/dashboard/portfolio-chart"
import { MarketOverview } from "@/components/dashboard/market-overview"
import { RecentActivity } from "@/components/dashboard/recent-activity"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user.displayName || "User"}!</h1>
            <p className="text-muted-foreground">Here's what's happening with your portfolio today.</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Last updated</p>
            <p className="text-sm font-medium">{new Date().toLocaleString()}</p>
          </div>
        </div>

        {/* Quick Stats */}
        <QuickStats />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Portfolio Chart - Takes 2 columns */}
          <PortfolioChart />

          {/* Market Overview - Takes 1 column */}
          <MarketOverview />
        </div>

        {/* Recent Activity */}
        <RecentActivity />
      </div>
    </DashboardLayout>
  )
}
