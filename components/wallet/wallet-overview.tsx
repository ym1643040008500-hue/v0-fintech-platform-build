"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/use-auth"
import { WalletService } from "@/lib/wallet-service"
import { CurrencyService } from "@/lib/currency-service"
import type { Wallet, Currency, Transaction } from "@/lib/types"
import {
  WalletIcon,
  TrendingUp,
  TrendingDown,
  Send,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"
import { DepositModal } from "./deposit-modal"
import { WithdrawalModal } from "./withdrawal-modal"

export function WalletOverview() {
  const { user } = useAuth()
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const mockCurrencies: Currency[] = [
    {
      id: "usd",
      code: "USD",
      name: "US Dollar",
      symbol: "$",
      decimals: 2,
      enabled: true,
      exchangeRate: 1.0,
      lastUpdated: new Date(),
      icon: "💵",
      description: "United States Dollar",
    },
    {
      id: "eur",
      code: "EUR",
      name: "Euro",
      symbol: "€",
      decimals: 2,
      enabled: true,
      exchangeRate: 0.85,
      lastUpdated: new Date(),
      icon: "💶",
      description: "European Euro",
    },
    {
      id: "sar",
      code: "SAR",
      name: "Saudi Riyal",
      symbol: "ر.س",
      decimals: 2,
      enabled: true,
      exchangeRate: 3.75,
      lastUpdated: new Date(),
      icon: "🇸🇦",
      description: "Saudi Arabian Riyal",
    },
  ]

  const mockWallet: Wallet = {
    id: "mock-wallet",
    userId: user?.uid || "mock-user",
    balances: [
      {
        currencyId: "usd",
        balance: 5000.0,
        lockedBalance: 0,
        availableBalance: 5000.0,
      },
      {
        currencyId: "eur",
        balance: 2500.0,
        lockedBalance: 100.0,
        availableBalance: 2400.0,
      },
      {
        currencyId: "sar",
        balance: 10000.0,
        lockedBalance: 0,
        availableBalance: 10000.0,
      },
    ],
    totalValueUSD: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const mockTransactions: Transaction[] = [
    {
      id: "tx1",
      userId: user?.uid || "mock-user",
      type: "deposit",
      status: "completed",
      amount: 1000.0,
      currencyId: "usd",
      fee: 5.0,
      description: "إيداع عبر بطاقة فيزا",
      paymentMethod: "visa-card",
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date(Date.now() - 86400000),
      completedAt: new Date(Date.now() - 86400000),
    },
    {
      id: "tx2",
      userId: user?.uid || "mock-user",
      type: "withdrawal",
      status: "pending",
      amount: -500.0,
      currencyId: "eur",
      fee: 2.5,
      description: "سحب إلى الحساب البنكي",
      paymentMethod: "bank-transfer",
      createdAt: new Date(Date.now() - 43200000),
      updatedAt: new Date(Date.now() - 43200000),
    },
    {
      id: "tx3",
      userId: user?.uid || "mock-user",
      type: "transfer",
      status: "completed",
      amount: 2000.0,
      currencyId: "sar",
      fee: 0,
      description: "تحويل من صديق",
      fromAddress: "friend-user-id",
      createdAt: new Date(Date.now() - 21600000),
      updatedAt: new Date(Date.now() - 21600000),
      completedAt: new Date(Date.now() - 21600000),
    },
  ]

  const mockPaymentMethods = [
    {
      id: "visa-card",
      name: "بطاقة فيزا",
      type: "card" as const,
      provider: "Visa",
      supportedCurrencies: ["usd", "eur", "sar"],
      fees: { percentage: 2.5, fixed: 0.5 },
      processingTime: "فوري",
      isActive: true,
    },
    {
      id: "bank-transfer",
      name: "تحويل بنكي",
      type: "bank_transfer" as const,
      provider: "البنك الأهلي",
      supportedCurrencies: ["sar", "usd"],
      fees: { percentage: 1.0, fixed: 2.0 },
      processingTime: "1-3 أيام",
      isActive: true,
    },
    {
      id: "stc-pay",
      name: "STC Pay",
      type: "mobile_money" as const,
      provider: "STC",
      supportedCurrencies: ["sar"],
      fees: { percentage: 1.5, fixed: 0 },
      processingTime: "فوري",
      isActive: true,
    },
  ]

  useEffect(() => {
    if (user) {
      loadWalletData()
    }
  }, [user])

  const loadWalletData = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      try {
        const walletService = WalletService.getInstance()
        const currencyService = CurrencyService.getInstance()

        const [walletData, currenciesData, transactionsData] = await Promise.all([
          walletService.getOrCreateWallet(user.uid),
          currencyService.getCurrencies(),
          walletService.getTransactions(user.uid, 10),
        ])

        setWallet(walletData)
        setCurrencies(currenciesData)
        setTransactions(transactionsData)
      } catch (firebaseError) {
        console.warn("Firebase not available, using mock data:", firebaseError)
        // Use mock data as fallback
        setWallet(mockWallet)
        setCurrencies(mockCurrencies)
        setTransactions(mockTransactions)
      }
    } catch (error) {
      console.error("Error loading wallet data:", error)
      setError("فشل في تحميل بيانات المحفظة. يرجى المحاولة مرة أخرى.")
      // Still provide mock data even on error
      setWallet(mockWallet)
      setCurrencies(mockCurrencies)
      setTransactions(mockTransactions)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
      case "processing":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "failed":
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getTransactionIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "deposit":
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />
      case "withdrawal":
        return <ArrowUpRight className="h-4 w-4 text-red-500" />
      case "transfer":
        return <Send className="h-4 w-4 text-blue-500" />
      default:
        return <WalletIcon className="h-4 w-4 text-muted-foreground" />
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
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
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري تحميل بيانات المحفظة...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-red-800 font-medium">خطأ في التحميل</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
            <Button
              onClick={loadWalletData}
              variant="outline"
              className="mt-4 border-red-300 text-red-700 hover:bg-red-100 bg-transparent"
            >
              إعادة المحاولة
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalBalance =
    wallet?.balances.reduce((sum, balance) => {
      const currency = currencies.find((c) => c.id === balance.currencyId)
      if (!currency) return sum
      return sum + balance.balance * currency.exchangeRate
    }, 0) || 0

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">إجمالي الرصيد</p>
                <p className="text-2xl font-bold">${totalBalance.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <WalletIcon className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">التغيير خلال 24 ساعة</p>
                <p className="text-2xl font-bold text-green-500">+$1,234.56</p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">العملات النشطة</p>
                <p className="text-2xl font-bold">{wallet?.balances.length || 0}</p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <TrendingDown className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>الإجراءات السريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <DepositModal currencies={currencies} paymentMethods={mockPaymentMethods} />
            <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
              <Send className="h-4 w-4" />
              <span>إرسال</span>
            </Button>
            <WithdrawalModal
              currencies={currencies}
              paymentMethods={mockPaymentMethods}
              balances={wallet?.balances || []}
            />
            <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
              <TrendingUp className="h-4 w-4" />
              <span>تداول</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Balances and Transactions */}
      <Tabs defaultValue="balances" className="space-y-4">
        <TabsList>
          <TabsTrigger value="balances">الأرصدة</TabsTrigger>
          <TabsTrigger value="transactions">المعاملات الحديثة</TabsTrigger>
        </TabsList>

        <TabsContent value="balances">
          <Card>
            <CardHeader>
              <CardTitle>أرصدة العملات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {wallet?.balances.map((balance) => {
                  const currency = currencies.find((c) => c.id === balance.currencyId)
                  if (!currency) return null

                  return (
                    <div key={balance.currencyId} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">{currency.symbol}</span>
                        </div>
                        <div>
                          <p className="font-medium">{currency.name}</p>
                          <p className="text-sm text-muted-foreground">{currency.code}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {balance.balance.toFixed(currency.decimals)} {currency.symbol}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ${(balance.balance * currency.exchangeRate).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )
                })}

                {(!wallet?.balances || wallet.balances.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    <WalletIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>لا توجد أرصدة بعد. قم بإجراء أول إيداع للبدء.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>المعاملات الحديثة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => {
                  const currency = currencies.find((c) => c.id === transaction.currencyId)
                  if (!currency) return null

                  return (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          {getTransactionIcon(transaction.type)}
                          {getStatusIcon(transaction.status)}
                        </div>
                        <div>
                          <p className="font-medium capitalize">{getTransactionTypeArabic(transaction.type)}</p>
                          <p className="text-sm text-muted-foreground">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {transaction.createdAt.toLocaleDateString("ar-SA")}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${transaction.amount >= 0 ? "text-green-500" : "text-red-500"}`}>
                          {transaction.amount >= 0 ? "+" : ""}
                          {transaction.amount.toFixed(currency.decimals)} {currency.symbol}
                        </p>
                        <Badge variant={transaction.status === "completed" ? "default" : "secondary"}>
                          {getStatusArabic(transaction.status)}
                        </Badge>
                      </div>
                    </div>
                  )
                })}

                {transactions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>لا توجد معاملات بعد. سيظهر سجل معاملاتك هنا.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )

  function getTransactionTypeArabic(type: Transaction["type"]): string {
    switch (type) {
      case "deposit":
        return "إيداع"
      case "withdrawal":
        return "سحب"
      case "transfer":
        return "تحويل"
      case "payment":
        return "دفع"
      case "trade":
        return "تداول"
      case "refund":
        return "استرداد"
      default:
        return type
    }
  }

  function getStatusArabic(status: Transaction["status"]): string {
    switch (status) {
      case "pending":
        return "معلق"
      case "processing":
        return "قيد المعالجة"
      case "completed":
        return "مكتمل"
      case "failed":
        return "فشل"
      case "cancelled":
        return "ملغي"
      default:
        return status
    }
  }
}
