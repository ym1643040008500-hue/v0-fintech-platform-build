"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, TrendingDown } from "lucide-react"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/hooks/use-auth"

interface MarketItem {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: string
  userId: string
}

export function MarketOverview() {
  const { user } = useAuth()
  const [marketData, setMarketData] = useState<MarketItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      try {
        const q = query(
          collection(db, "marketData"),
          where("userId", "==", user.uid)
        )
        const snapshot = await getDocs(q)

        if (snapshot.empty) {
          setMarketData([])
        } else {
          const data = snapshot.docs.map((doc) => doc.data() as MarketItem)
          setMarketData(data)
        }
      } catch (err: any) {
        console.error("Error fetching market data:", err)
        setError("Failed to load market data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Market Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex flex-col space-y-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-12" />
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-3 w-10" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Market Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-500">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (marketData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Market Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No market data available for this user.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Market Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {marketData.map((item) => {
            const isPositive = (item?.change ?? 0) >= 0
            const price = item?.price ?? 0

            return (
              <div key={item.symbol} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex flex-col">
                  <span className="font-medium text-sm">{item.symbol}</span>
                  <span className="text-xs text-muted-foreground">{item.name}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-medium text-sm">${price.toLocaleString()}</span>
                  <div className="flex items-center space-x-1">
                    <Badge variant={isPositive ? "default" : "destructive"} className="text-xs">
                      {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                      {isPositive ? "+" : ""}
                      {item.changePercent ?? 0}%
                    </Badge>
                    <span className="text-xs text-muted-foreground">{item.volume ?? "-"}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
