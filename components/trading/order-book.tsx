"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface OrderBookEntry {
  price: number
  amount: number
  total: number
}

const mockBids: OrderBookEntry[] = [
  { price: 44950, amount: 0.5234, total: 23.52 },
  { price: 44925, amount: 1.2341, total: 55.43 },
  { price: 44900, amount: 0.8765, total: 39.36 },
  { price: 44875, amount: 2.1234, total: 95.31 },
  { price: 44850, amount: 0.6543, total: 29.35 },
  { price: 44825, amount: 1.4567, total: 65.28 },
  { price: 44800, amount: 0.9876, total: 44.25 },
  { price: 44775, amount: 1.7654, total: 79.08 },
]

const mockAsks: OrderBookEntry[] = [
  { price: 45050, amount: 0.4321, total: 19.47 },
  { price: 45075, amount: 1.1234, total: 50.63 },
  { price: 45100, amount: 0.7654, total: 34.52 },
  { price: 45125, amount: 1.9876, total: 89.71 },
  { price: 45150, amount: 0.5432, total: 24.52 },
  { price: 45175, amount: 1.3456, total: 60.78 },
  { price: 45200, amount: 0.8765, total: 39.62 },
  { price: 45225, amount: 1.6543, total: 74.85 },
]

export function OrderBook() {
  const maxTotal = Math.max(...mockBids.map((b) => b.total), ...mockAsks.map((a) => a.total))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium flex items-center justify-between">
          Order Book
          <Badge variant="secondary" className="text-xs">
            BTC/USD
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Header */}
        <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground font-medium">
          <span>Price (USD)</span>
          <span className="text-right">Amount (BTC)</span>
          <span className="text-right">Total</span>
        </div>

        {/* Asks (Sell Orders) */}
        <div className="space-y-1">
          {mockAsks.reverse().map((ask, index) => (
            <div key={index} className="relative">
              <div
                className="absolute inset-0 bg-red-500/10 rounded"
                style={{ width: `${(ask.total / maxTotal) * 100}%` }}
              />
              <div className="relative grid grid-cols-3 gap-2 text-xs py-1 px-2 hover:bg-muted/50 cursor-pointer">
                <span className="text-red-500 font-medium">{ask.price.toLocaleString()}</span>
                <span className="text-right">{ask.amount.toFixed(4)}</span>
                <span className="text-right text-muted-foreground">{ask.total.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Spread */}
        <div className="flex items-center justify-center py-2 border-y">
          <div className="text-center">
            <div className="text-lg font-bold">$45,000</div>
            <div className="text-xs text-muted-foreground">Spread: $100 (0.22%)</div>
          </div>
        </div>

        {/* Bids (Buy Orders) */}
        <div className="space-y-1">
          {mockBids.map((bid, index) => (
            <div key={index} className="relative">
              <div
                className="absolute inset-0 bg-green-500/10 rounded"
                style={{ width: `${(bid.total / maxTotal) * 100}%` }}
              />
              <div className="relative grid grid-cols-3 gap-2 text-xs py-1 px-2 hover:bg-muted/50 cursor-pointer">
                <span className="text-green-500 font-medium">{bid.price.toLocaleString()}</span>
                <span className="text-right">{bid.amount.toFixed(4)}</span>
                <span className="text-right text-muted-foreground">{bid.total.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
