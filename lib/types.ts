export interface Currency {
  id: string
  code: string
  name: string
  symbol: string
  decimals: number
  enabled: boolean
  exchangeRate: number
  lastUpdated: Date
  icon?: string
  description?: string
}

export interface WalletBalance {
  currencyId: string
  balance: number
  lockedBalance: number
  availableBalance: number
}

export interface Transaction {
  id: string
  userId: string
  type: "deposit" | "withdrawal" | "transfer" | "payment" | "trade" | "refund"
  status: "pending" | "processing" | "completed" | "failed" | "cancelled"
  amount: number
  currencyId: string
  fee: number
  description: string
  reference?: string
  fromAddress?: string
  toAddress?: string
  paymentMethod?: string
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
}

export interface PaymentMethod {
  id: string
  type: "card" | "bank_transfer" | "mobile_money" | "crypto" | "voucher" | "qr_code"
  name: string
  provider: string
  enabled: boolean
  fees: {
    fixed: number
    percentage: number
    min: number
    max: number
  }
  limits: {
    min: number
    max: number
    daily: number
    monthly: number
  }
  processingTime: string
  supportedCurrencies: string[]
}

export interface Wallet {
  id: string
  userId: string
  balances: WalletBalance[]
  totalValueUSD: number
  createdAt: Date
  updatedAt: Date
}

export interface PaymentRequest {
  amount: number
  currencyId: string
  paymentMethodId: string
  description?: string
  metadata?: Record<string, any>
}
