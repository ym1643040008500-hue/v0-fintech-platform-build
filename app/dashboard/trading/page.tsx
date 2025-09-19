"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { TradingChart } from "@/components/trading/trading-chart"
import { OrderBook } from "@/components/trading/order-book"
import { TradeForm } from "@/components/trading/trade-form"
import { RecentTrades } from "@/components/trading/recent-trades"
import { OpenOrders } from "@/components/trading/open-orders"
import { TradingPairSelector } from "@/components/trading/trading-pair-selector"
import { TradingStats } from "@/components/trading/trading-stats"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  BarChart3,
  Settings,
} from "lucide-react"
import type { TradingPair } from "@/lib/trading-types"

// Firebase
import { db } from "@/lib/firebase"
import { collection, onSnapshot } from "firebase/firestore"

// Helper to coerce to number safely
function toNum(v: any): number {
  if (v === null || v === undefined) return 0
  if (typeof v === "number") return v
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

export default function TradingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [pairs, setPairs] = useState<TradingPair[]>([])
  const [selectedPair, setSelectedPair] = useState<TradingPair | null>(null)
  const [isAdvancedMode, setIsAdvancedMode] = useState(false)
  const [loadingPairs, setLoadingPairs] = useState(true)

  // subscribe to Firestore collection "pairs"
  useEffect(() => {
    setLoadingPairs(true)
    const unsub = onSnapshot(
      collection(db, "pairs"),
      (snapshot) => {
        const fetched: TradingPair[] = snapshot.docs.map((doc) => {
          const d: any = doc.data()
          return {
            id: doc.id,
            baseAsset: d.baseAsset ?? "",
            quoteAsset: d.quoteAsset ?? "USDT",
            symbol: d.symbol ?? `${d.baseAsset ?? ""}/USDT`,
            // coerce numeric fields
            price: toNum(d.price),
            change24h: toNum(d.change24h),
            volume24h: toNum(d.volume24h),
            high24h: toNum(d.high24h),
            low24h: toNum(d.low24h),
            lastUpdated: d.lastUpdated ? new Date(d.lastUpdated) : new Date(),
          } as TradingPair
        })

        setPairs(fetched)

        // keep previously selected pair if exists (match by id), otherwise pick first
        setSelectedPair((prev) => {
          if (!fetched || fetched.length === 0) return null
          if (!prev) return fetched[0]
          const found = fetched.find((p) => p.id === prev.id)
          return found ?? fetched[0]
        })

        setLoadingPairs(false)
      },
      (err) => {
        console.error("pairs onSnapshot error:", err)
        setLoadingPairs(false)
      }
    )

    return () => unsub()
    // empty deps: subscribe once
  }, [])

  // auth redirect
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  if (loading || loadingPairs) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) return null

  // guard: selectedPair could still be null if no docs in collection
  if (!selectedPair) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="text-center py-8 text-muted-foreground">
            <h2 className="text-xl font-medium">No trading pairs found</h2>
            <p className="text-sm">Please add pairs to the "pairs" collection in Firestore.</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // ensure numeric value for display
  const change24hNum = toNum(selectedPair.change24h)
  const priceNum = toNum(selectedPair.price)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-3xl font-bold">Advanced Trading</h1>
              <p className="text-muted-foreground">Live market data from Firestore</p>
            </div>
            <Badge
              variant={change24hNum >= 0 ? "default" : "destructive"}
              className="text-sm"
            >
              {change24hNum >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {change24hNum >= 0 ? "+" : ""}
              {change24hNum.toFixed(2)}%
            </Badge>
          </div>

          <div className="flex items-center space-x-3">
            <TradingPairSelector
              pairs={pairs}
              selectedPair={selectedPair}
              onPairChange={setSelectedPair}
            />
            <Button
              variant={isAdvancedMode ? "default" : "outline"}
              size="sm"
              onClick={() => setIsAdvancedMode(!isAdvancedMode)}
            >
              <Settings className="h-4 w-4 mr-2" />
              {isAdvancedMode ? "Simple" : "Advanced"}
            </Button>
          </div>
        </div>

        {/* Stats */}
        <TradingStats pair={selectedPair} />

        {/* Chart + TradeForm */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <TradingChart pair={selectedPair} isAdvanced={isAdvancedMode} />
          </div>

          <div className="space-y-6">
            <TradeForm symbol={selectedPair.symbol} currentPrice={priceNum} />

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Market Buy
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Stop Loss
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Activity className="h-4 w-4 mr-2" />
                  Take Profit
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Orderbook + Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <OrderBook pair={selectedPair} />
          <div className="lg:col-span-2">
            <Tabs defaultValue="recent-trades" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="recent-trades">Recent Trades</TabsTrigger>
                <TabsTrigger value="open-orders">Open Orders</TabsTrigger>
                <TabsTrigger value="trade-history">History</TabsTrigger>
              </TabsList>
              <TabsContent value="recent-trades" className="mt-4">
                <RecentTrades pair={selectedPair} />
              </TabsContent>
              <TabsContent value="open-orders" className="mt-4">
                <OpenOrders />
              </TabsContent>
              <TabsContent value="trade-history" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Trade History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Your trade history will appear here</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
