"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, TrendingUp, ArrowUpRight, Clock } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"

export function QuickStats() {
  const { user } = useAuth()
  const [stats, setStats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return
      try {
        const docRef = doc(db, "users", user.uid)
        const snap = await getDoc(docRef)
        if (snap.exists()) {
          const data = snap.data()

          // استخدام القيم الافتراضية إذا كانت غير موجودة
          const totalBalance = data.totalBalance ?? 0
          const todaysPL = data.todaysPL ?? 0
          const activePositions = data.activePositions ?? 0
          const pendingOrders = data.pendingOrders ?? 0

          setStats([
            {
              title: "Total Balance",
              value: `$${totalBalance.toLocaleString()}`,
              change: "+$1,200",
              changePercent: "+9.3%",
              icon: Wallet,
              trend: "up",
            },
            {
              title: "Today's P&L",
              value: `${todaysPL >= 0 ? "+" : ""}$${todaysPL.toLocaleString()}`,
              change: "vs yesterday",
              changePercent: "+2.1%",
              icon: TrendingUp,
              trend: todaysPL >= 0 ? "up" : "down",
            },
            {
              title: "Active Positions",
              value: activePositions,
              change: "positions open",
              changePercent: "",
              icon: ArrowUpRight,
              trend: "up",
            },
            {
              title: "Pending Orders",
              value: pendingOrders,
              change: "limit orders",
              changePercent: "",
              icon: Clock,
              trend: "neutral",
            },
          ])
        }
      } catch (err) {
        console.error("Error fetching stats:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [user])

  if (loading) return <p>Loading stats...</p>
  if (!stats.length) return <p>No stats available</p>

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
                    {stat.changePercent && (
                      <Badge
                        variant={
                          stat.trend === "up"
                            ? "default"
                            : stat.trend === "down"
                            ? "destructive"
                            : "secondary"
                        }
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
                      ? "bg-red-500/10 text-red-500"
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
