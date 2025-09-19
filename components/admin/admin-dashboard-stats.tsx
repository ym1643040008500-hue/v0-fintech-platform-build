"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, CreditCard, AlertTriangle, Shield, TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react"

const stats = [
  {
    title: "Total Users",
    value: "12,345",
    change: "+234",
    changePercent: "+2.1%",
    icon: Users,
    trend: "up",
  },
  {
    title: "Active Transactions",
    value: "1,567",
    change: "+89",
    changePercent: "+6.0%",
    icon: CreditCard,
    trend: "up",
  },
  {
    title: "Pending KYC",
    value: "45",
    change: "-12",
    changePercent: "-21%",
    icon: Shield,
    trend: "down",
  },
  {
    title: "System Alerts",
    value: "8",
    change: "+3",
    changePercent: "+60%",
    icon: AlertTriangle,
    trend: "up",
  },
  {
    title: "Daily Volume",
    value: "$2.4M",
    change: "+$340K",
    changePercent: "+16.5%",
    icon: DollarSign,
    trend: "up",
  },
  {
    title: "Platform Uptime",
    value: "99.9%",
    change: "0.0%",
    changePercent: "Stable",
    icon: Activity,
    trend: "neutral",
  },
  {
    title: "Risk Score Avg",
    value: "2.3",
    change: "-0.2",
    changePercent: "-8%",
    icon: TrendingDown,
    trend: "down",
  },
  {
    title: "Revenue (24h)",
    value: "$45.2K",
    change: "+$8.1K",
    changePercent: "+21.8%",
    icon: TrendingUp,
    trend: "up",
  },
]

export function AdminDashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">{stat.change}</span>
                    {stat.changePercent !== "Stable" && (
                      <Badge
                        variant={stat.trend === "up" ? "default" : stat.trend === "down" ? "secondary" : "outline"}
                        className="text-xs"
                      >
                        {stat.changePercent}
                      </Badge>
                    )}
                  </div>
                </div>
                <div
                  className={`p-3 rounded-lg ${
                    stat.trend === "up"
                      ? "bg-green-500/10 text-green-500"
                      : stat.trend === "down"
                        ? "bg-blue-500/10 text-blue-500"
                        : "bg-primary/10 text-primary"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
