"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronDown, Search, TrendingUp, TrendingDown } from "lucide-react"
import type { TradingPair } from "@/lib/trading-types"

interface TradingPairSelectorProps {
  pairs: TradingPair[]
  selectedPair: TradingPair
  onPairChange: (pair: TradingPair) => void
}

export function TradingPairSelector({ pairs, selectedPair, onPairChange }: TradingPairSelectorProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPairs = pairs.filter(
    (pair) =>
      pair.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pair.baseAsset.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pair.quoteAsset.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-between bg-transparent">
          <div className="flex items-center space-x-2">
            <span className="font-medium">{selectedPair.symbol}</span>
            <Badge variant={selectedPair.change24h >= 0 ? "default" : "destructive"} className="text-xs">
              {selectedPair.change24h >= 0 ? "+" : ""}
              {selectedPair.change24h.toFixed(2)}%
            </Badge>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search trading pairs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {filteredPairs.map((pair) => (
            <div
              key={pair.id}
              className="p-3 hover:bg-accent cursor-pointer border-b last:border-b-0"
              onClick={() => {
                onPairChange(pair)
                setOpen(false)
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{pair.symbol}</div>
                  <div className="text-sm text-muted-foreground">${pair.price.toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div
                    className={`flex items-center text-sm ${pair.change24h >= 0 ? "text-green-500" : "text-red-500"}`}
                  >
                    {pair.change24h >= 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {pair.change24h >= 0 ? "+" : ""}
                    {pair.change24h.toFixed(2)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Vol: ${(pair.volume24h / 1000000).toFixed(1)}M</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
