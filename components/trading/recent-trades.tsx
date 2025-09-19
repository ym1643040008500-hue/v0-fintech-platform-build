"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"
import type { TradingPair } from "@/lib/trading-types"

interface Trade {
  id: string
  price: number
  amount: number
  side: "buy" | "sell"
  timestamp: Date
}

interface RecentTradesProps {
  pair: TradingPair
}

export function RecentTrades({ pair }: RecentTradesProps) {
  const [trades, setTrades] = useState<Trade[]>([])

  useEffect(() => {
    // Generate mock trades
    const generateTrade = (): Trade => ({
      id: Math.random().toString(36).substr(2, 9),
      price: pair.price + (Math.random() - 0.5) * 100,
      amount: Math.random() * 10,
      side: Math.random() > 0.5 ? "buy" : "sell",
      timestamp: new Date(),
    })

    // Initial trades
    setTrades(Array.from({ length: 10 }, generateTrade))

    // Add new trades periodically
    const interval = setInterval(() => {
      setTrades((prev) => [generateTrade(), ...prev.slice(0, 19)])
    }, 3000)

    return () => clearInterval(interval)
  }, [pair])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          Recent Trades
          <Badge variant="outline" className="ml-2">
            {pair.symbol}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          <div className="grid grid-cols-4 gap-2 text-sm font-medium text-muted-foreground border-b pb-2">
            <div>Price</div>
            <div>Amount</div>
            <div>Side</div>
            <div>Time</div>
          </div>
          {trades.map((trade) => (
            <div key={trade.id} className="grid grid-cols-4 gap-2 text-sm py-1 hover:bg-accent/50 rounded">
              <div className={`font-medium ${trade.side === "buy" ? "text-green-500" : "text-red-500"}`}>
                ${trade.price.toFixed(2)}
              </div>
              <div>{trade.amount.toFixed(4)}</div>
              <div>
                <Badge variant={trade.side === "buy" ? "default" : "destructive"} className="text-xs">
                  {trade.side === "buy" ? (
                    <TrendingUp className="h-2 w-2 mr-1" />
                  ) : (
                    <TrendingDown className="h-2 w-2 mr-1" />
                  )}
                  {trade.side.toUpperCase()}
                </Badge>
              </div>
              <div className="text-muted-foreground">{trade.timestamp.toLocaleTimeString()}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
