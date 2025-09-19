"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import { TrendingUp, TrendingDown, Calendar } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, query, orderBy, onSnapshot } from "firebase/firestore"
import { useAuth } from "@/hooks/use-auth"

export function PortfolioChart() {
  const { user } = useAuth()
  const [portfolioData, setPortfolioData] = useState<any[]>([])

  useEffect(() => {
    if (!user) return

    const q = query(
      collection(db, "users", user.uid, "portfolioHistory"),
      orderBy("date", "asc")
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        // حول date لعرض قصير زي "Jan 1"
        date: new Date(doc.data().date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      }))
      setPortfolioData(data)
    })

    return () => unsubscribe()
  }, [user])

  if (portfolioData.length === 0) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="text-base font-medium">Portfolio Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No data available yet.</p>
        </CardContent>
      </Card>
    )
  }

  const currentValue = portfolioData[portfolioData.length - 1].value
  const previousValue = portfolioData[portfolioData.length - 2]?.value || currentValue
  const change = currentValue - previousValue
  const changePercent = ((change / previousValue) * 100).toFixed(2)
  const isPositive = change >= 0

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">Portfolio Performance</CardTitle>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold">${currentValue.toLocaleString()}</span>
            <Badge variant={isPositive ? "default" : "destructive"} className="flex items-center space-x-1">
              {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              <span>
                {isPositive ? "+" : ""}
                {changePercent}%
              </span>
            </Badge>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="bg-transparent">
            <Calendar className="h-4 w-4 mr-2" />
            Last 30 days
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={portfolioData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-xs fill-muted-foreground" axisLine={false} tickLine={false} />
              <YAxis
                className="text-xs fill-muted-foreground"
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">Date</span>
                            <span className="font-bold text-muted-foreground">{label}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">Value</span>
                            <span className="font-bold">${payload[0].value?.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
