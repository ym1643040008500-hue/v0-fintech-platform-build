"use client"

import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"

export default function AdminAnalyticsPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Admin Analytics</h1>
        <p className="text-muted-foreground">
          Advanced business intelligence and performance monitoring for administrators
        </p>
      </div>
      <AnalyticsDashboard />
    </div>
  )
}
