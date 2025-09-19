"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Clock } from "lucide-react"

interface Order {
  id: string
  symbol: string
  side: "buy" | "sell"
  type: "limit" | "market" | "stop"
  amount: number
  price: number
  filled: number
  status: "pending" | "partial" | "filled" | "cancelled"
  timestamp: Date
}

export function OpenOrders() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "1",
      symbol: "BTC/USD",
      side: "buy",
      type: "limit",
      amount: 0.5,
      price: 44000,
      filled: 0.2,
      status: "partial",
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: "2",
      symbol: "ETH/USD",
      side: "sell",
      type: "limit",
      amount: 2.0,
      price: 2700,
      filled: 0,
      status: "pending",
      timestamp: new Date(Date.now() - 1800000),
    },
  ])

  const cancelOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== orderId))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Open Orders
          <Badge variant="outline" className="ml-2">
            {orders.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No open orders</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-lg p-3 hover:bg-accent/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant={order.side === "buy" ? "default" : "destructive"}>{order.side.toUpperCase()}</Badge>
                    <span className="font-medium">{order.symbol}</span>
                    <Badge variant="outline" className="text-xs">
                      {order.type}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => cancelOrder(order.id)}
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Amount:</span>
                    <div className="font-medium">
                      {order.amount} {order.symbol.split("/")[0]}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Price:</span>
                    <div className="font-medium">${order.price.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Filled:</span>
                    <div className="font-medium">{((order.filled / order.amount) * 100).toFixed(1)}%</div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">Created: {order.timestamp.toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
