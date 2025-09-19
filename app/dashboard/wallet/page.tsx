"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/lib/firebase"
import { collection, onSnapshot } from "firebase/firestore"

type WalletAsset = {
  id: string
  symbol: string
  balance: number
  valueUSD: number
}

export function WalletOverview() {
  const [assets, setAssets] = useState<WalletAsset[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "wallet"), (snapshot) => {
      const fetched: WalletAsset[] = snapshot.docs.map((doc) => {
        const d: any = doc.data()
        return {
          id: doc.id,
          symbol: d.symbol ?? "",
          balance: Number(d.balance ?? 0),
          valueUSD: Number(d.valueUSD ?? 0),
        }
      })
      setAssets(fetched)
      setLoading(false)
    })

    return () => unsub()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-muted rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {assets.map((asset) => (
        <Card key={asset.id}>
          <CardHeader>
            <CardTitle>{asset.symbol}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold">{asset.balance.toFixed(4)}</p>
            <p className="text-sm text-muted-foreground">
              ≈ ${asset.valueUSD.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
