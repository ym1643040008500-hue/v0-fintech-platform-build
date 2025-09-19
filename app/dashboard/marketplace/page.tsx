"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { MarketplaceGrid } from "@/components/marketplace/marketplace-grid"
import { Button } from "@/components/ui/button"
import { Plus, TrendingUp, Users, ShoppingBag } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function MarketplacePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [itemsCount, setItemsCount] = useState(0)
  const [sellersCount, setSellersCount] = useState(0)
  const [volume, setVolume] = useState(0)
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // إجمالي عدد العناصر
        const itemsSnapshot = await getDocs(collection(db, "marketItems"))
        setItemsCount(itemsSnapshot.size)

        // البائعين (distinct userIds)
        const sellers = new Set<string>()
        itemsSnapshot.forEach((doc) => {
          const data = doc.data()
          if (data.userId) sellers.add(data.userId)
        })
        setSellersCount(sellers.size)

        // حجم التداول (مجموع prices)
        let totalVolume = 0
        itemsSnapshot.forEach((doc) => {
          const data = doc.data()
          if (data.price) totalVolume += Number(data.price)
        })
        setVolume(totalVolume)
      } catch (err) {
        console.error("Error fetching marketplace stats:", err)
      } finally {
        setStatsLoading(false)
      }
    }

    if (user) fetchStats()
  }, [user])

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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Marketplace</h1>
            <p className="text-muted-foreground">
              Discover and trade digital assets with escrow protection
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            List Item
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Items</p>
                  <p className="text-2xl font-bold">
                    {statsLoading ? "..." : itemsCount}
                  </p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Sellers</p>
                  <p className="text-2xl font-bold">
                    {statsLoading ? "..." : sellersCount}
                  </p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Volume (all time)</p>
                  <p className="text-2xl font-bold">
                    {statsLoading ? "..." : `$${volume.toLocaleString()}`}
                  </p>
                </div>
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Marketplace Grid */}
        <MarketplaceGrid />
      </div>
    </DashboardLayout>
  )
}
