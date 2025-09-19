export interface TradingPair {
  id: string
  baseAsset: string
  quoteAsset: string
  symbol: string
  price: number
  change24h: number
  volume24h: number
  high24h: number
  low24h: number
  lastUpdated: Date
}

export interface Order {
  id: string
  userId: string
  symbol: string
  type: "market" | "limit" | "stop" | "stop_limit"
  side: "buy" | "sell"
  amount: number
  price?: number
  stopPrice?: number
  status: "pending" | "filled" | "cancelled" | "partially_filled"
  filledAmount: number
  remainingAmount: number
  createdAt: Date
  updatedAt: Date
  expiresAt?: Date
}

export interface Trade {
  id: string
  orderId: string
  userId: string
  symbol: string
  side: "buy" | "sell"
  amount: number
  price: number
  fee: number
  timestamp: Date
}

export interface MarketplaceItem {
  id: string
  sellerId: string
  title: string
  description: string
  category: string
  price: number
  currency: string
  images: string[]
  tags: string[]
  status: "active" | "sold" | "inactive"
  escrowEnabled: boolean
  rating: number
  reviewCount: number
  createdAt: Date
  updatedAt: Date
}

export interface MarketplaceOrder {
  id: string
  itemId: string
  buyerId: string
  sellerId: string
  amount: number
  currency: string
  status: "pending" | "paid" | "shipped" | "delivered" | "completed" | "disputed" | "cancelled"
  escrowId?: string
  createdAt: Date
  updatedAt: Date
}

export interface Candlestick {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}
