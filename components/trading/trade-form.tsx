"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { TrendingUp, TrendingDown, Calculator } from "lucide-react"

interface TradeFormProps {
  symbol: string
  currentPrice: number
}

export function TradeForm({ symbol, currentPrice }: TradeFormProps) {
  const [orderType, setOrderType] = useState("market")
  const [amount, setAmount] = useState("")
  const [price, setPrice] = useState(currentPrice.toString())
  const [stopPrice, setStopPrice] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleTrade = async (side: "buy" | "sell") => {
    if (!amount) {
      toast({
        title: "Error",
        description: "Please enter an amount",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Order Placed",
        description: `${side.toUpperCase()} order for ${amount} ${symbol.split("/")[0]} has been placed`,
      })

      // Reset form
      setAmount("")
      setPrice(currentPrice.toString())
      setStopPrice("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to place order",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const calculateTotal = () => {
    const amountNum = Number.parseFloat(amount) || 0
    const priceNum = orderType === "market" ? currentPrice : Number.parseFloat(price) || 0
    return (amountNum * priceNum).toFixed(2)
  }

  const calculateFee = () => {
    const total = Number.parseFloat(calculateTotal()) || 0
    return (total * 0.001).toFixed(2) // 0.1% fee
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium flex items-center justify-between">
          Place Order
          <Badge variant="secondary" className="text-xs">
            {symbol}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="buy" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy" className="text-green-500 data-[state=active]:text-green-500">
              <TrendingUp className="h-4 w-4 mr-2" />
              Buy
            </TabsTrigger>
            <TabsTrigger value="sell" className="text-red-500 data-[state=active]:text-red-500">
              <TrendingDown className="h-4 w-4 mr-2" />
              Sell
            </TabsTrigger>
          </TabsList>

          <TabsContent value="buy" className="space-y-4">
            <div className="space-y-4">
              {/* Order Type */}
              <div className="space-y-2">
                <Label>Order Type</Label>
                <Select value={orderType} onValueChange={setOrderType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="market">Market</SelectItem>
                    <SelectItem value="limit">Limit</SelectItem>
                    <SelectItem value="stop">Stop</SelectItem>
                    <SelectItem value="stop_limit">Stop Limit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price (for limit orders) */}
              {(orderType === "limit" || orderType === "stop_limit") && (
                <div className="space-y-2">
                  <Label>Price (USD)</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    step="0.01"
                  />
                </div>
              )}

              {/* Stop Price (for stop orders) */}
              {(orderType === "stop" || orderType === "stop_limit") && (
                <div className="space-y-2">
                  <Label>Stop Price (USD)</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={stopPrice}
                    onChange={(e) => setStopPrice(e.target.value)}
                    step="0.01"
                  />
                </div>
              )}

              {/* Amount */}
              <div className="space-y-2">
                <Label>Amount ({symbol.split("/")[0]})</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  step="0.0001"
                />
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setAmount("0.25")} className="bg-transparent">
                    25%
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setAmount("0.5")} className="bg-transparent">
                    50%
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setAmount("0.75")} className="bg-transparent">
                    75%
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setAmount("1")} className="bg-transparent">
                    100%
                  </Button>
                </div>
              </div>

              {/* Order Summary */}
              {amount && (
                <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center space-x-1">
                      <Calculator className="h-3 w-3" />
                      <span>Order Summary</span>
                    </span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span>
                        {amount} {symbol.split("/")[0]}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Price:</span>
                      <span>${orderType === "market" ? currentPrice.toLocaleString() : price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total:</span>
                      <span>${calculateTotal()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fee (0.1%):</span>
                      <span>${calculateFee()}</span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-1">
                      <span>Total Cost:</span>
                      <span>
                        ${(Number.parseFloat(calculateTotal()) + Number.parseFloat(calculateFee())).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <Button
                onClick={() => handleTrade("buy")}
                disabled={loading || !amount}
                className="w-full bg-green-500 hover:bg-green-600 text-white"
              >
                {loading ? "Placing Order..." : `Buy ${symbol.split("/")[0]}`}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="sell" className="space-y-4">
            <div className="space-y-4">
              {/* Order Type */}
              <div className="space-y-2">
                <Label>Order Type</Label>
                <Select value={orderType} onValueChange={setOrderType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="market">Market</SelectItem>
                    <SelectItem value="limit">Limit</SelectItem>
                    <SelectItem value="stop">Stop</SelectItem>
                    <SelectItem value="stop_limit">Stop Limit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price (for limit orders) */}
              {(orderType === "limit" || orderType === "stop_limit") && (
                <div className="space-y-2">
                  <Label>Price (USD)</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    step="0.01"
                  />
                </div>
              )}

              {/* Stop Price (for stop orders) */}
              {(orderType === "stop" || orderType === "stop_limit") && (
                <div className="space-y-2">
                  <Label>Stop Price (USD)</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={stopPrice}
                    onChange={(e) => setStopPrice(e.target.value)}
                    step="0.01"
                  />
                </div>
              )}

              {/* Amount */}
              <div className="space-y-2">
                <Label>Amount ({symbol.split("/")[0]})</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  step="0.0001"
                />
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setAmount("0.25")} className="bg-transparent">
                    25%
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setAmount("0.5")} className="bg-transparent">
                    50%
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setAmount("0.75")} className="bg-transparent">
                    75%
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setAmount("1")} className="bg-transparent">
                    100%
                  </Button>
                </div>
              </div>

              {/* Order Summary */}
              {amount && (
                <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center space-x-1">
                      <Calculator className="h-3 w-3" />
                      <span>Order Summary</span>
                    </span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span>
                        {amount} {symbol.split("/")[0]}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Price:</span>
                      <span>${orderType === "market" ? currentPrice.toLocaleString() : price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total:</span>
                      <span>${calculateTotal()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fee (0.1%):</span>
                      <span>${calculateFee()}</span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-1">
                      <span>You'll Receive:</span>
                      <span>
                        ${(Number.parseFloat(calculateTotal()) - Number.parseFloat(calculateFee())).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <Button
                onClick={() => handleTrade("sell")}
                disabled={loading || !amount}
                className="w-full bg-red-500 hover:bg-red-600 text-white"
              >
                {loading ? "Placing Order..." : `Sell ${symbol.split("/")[0]}`}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
