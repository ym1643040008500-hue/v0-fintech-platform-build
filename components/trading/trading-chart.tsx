"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { TrendingUp, TrendingDown, BarChart3, Activity, Maximize2 } from "lucide-react"
import type { TradingPair, Candlestick } from "@/lib/trading-types"

interface TradingChartProps {
  pair: TradingPair
}

// Mock candlestick data
const generateMockData = (): Candlestick[] => {
  const data: Candlestick[] = []
  let price = 45000
  const now = Date.now()

  for (let i = 100; i >= 0; i--) {
    const timestamp = now - i * 60000 // 1 minute intervals
    const change = (Math.random() - 0.5) * 1000
    const open = price
    const close = price + change
    const high = Math.max(open, close) + Math.random() * 200
    const low = Math.min(open, close) - Math.random() * 200
    const volume = Math.random() * 1000000

    data.push({
      timestamp,
      open,
      high,
      low,
      close,
      volume,
    })

    price = close
  }

  return data
}

export function TradingChart({ pair }: TradingChartProps) {
  const [timeframe, setTimeframe] = useState("1h")
  const [chartType, setChartType] = useState("line")
  const [data, setData] = useState<Candlestick[]>([])

  useEffect(() => {
    setData(generateMockData())
  }, [pair.symbol, timeframe])

  const chartData = data.map((item) => ({
    time: new Date(item.timestamp).toLocaleTimeString(),
    price: item.close,
    volume: item.volume,
  }))

  const isPositive = pair.change24h >= 0

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-lg font-semibold">{pair.symbol}</CardTitle>
          <div className="flex items-center space-x-4">
            <span className="text-2xl font-bold">${pair.price.toLocaleString()}</span>
            <Badge variant={isPositive ? "default" : "destructive"} className="flex items-center space-x-1">
              {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              <span>
                {isPositive ? "+" : ""}
                {pair.change24h.toFixed(2)}%
              </span>
            </Badge>
          </div>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>24h High: ${pair.high24h.toLocaleString()}</span>
            <span>24h Low: ${pair.low24h.toLocaleString()}</span>
            <span>Volume: ${(pair.volume24h / 1000000).toFixed(1)}M</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">1m</SelectItem>
              <SelectItem value="5m">5m</SelectItem>
              <SelectItem value="15m">15m</SelectItem>
              <SelectItem value="1h">1h</SelectItem>
              <SelectItem value="4h">4h</SelectItem>
              <SelectItem value="1d">1d</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => setChartType(chartType === "line" ? "candle" : "line")}>
            {chartType === "line" ? <BarChart3 className="h-4 w-4" /> : <Activity className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="sm">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="time" className="text-xs fill-muted-foreground" axisLine={false} tickLine={false} />
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
                      <div className="rounded-lg border bg-background p-3 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">Time</span>
                            <span className="font-bold text-muted-foreground">{label}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">Price</span>
                            <span className="font-bold">${payload[0].value?.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
