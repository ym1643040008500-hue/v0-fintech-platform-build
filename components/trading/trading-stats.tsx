"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Volume2 } from "lucide-react"
import type { TradingPair } from "@/lib/trading-types"

interface TradingStatsProps {
  pair: TradingPair
}

export function TradingStats({ pair }: TradingStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current Price</p>
              <p className="text-2xl font-bold">${pair.price.toLocaleString()}</p>
            </div>
            <Badge variant={pair.change24h >= 0 ? "default" : "destructive"}>
              {pair.change24h >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {pair.change24h >= 0 ? "+" : ""}
              {pair.change24h.toFixed(2)}%
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">24h High</p>
              <p className="text-xl font-semibold text-green-500">${pair.high24h.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">24h Low</p>
              <p className="text-xl font-semibold text-red-500">${pair.low24h.toLocaleString()}</p>
            </div>
            <TrendingDown className="h-5 w-5 text-red-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">24h Volume</p>
              <p className="text-xl font-semibold">${(pair.volume24h / 1000000).toFixed(1)}M</p>
            </div>
            <Volume2 className="h-5 w-5 text-primary" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
