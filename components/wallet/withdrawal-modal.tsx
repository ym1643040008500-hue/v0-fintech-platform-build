"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { WalletService } from "@/lib/wallet-service"
import type { PaymentMethod, Currency, WalletBalance } from "@/lib/types"
import {
  ArrowUpRight,
  CreditCard,
  Smartphone,
  Building,
  Bitcoin,
  QrCode,
  Receipt,
  Clock,
  DollarSign,
  AlertTriangle,
} from "lucide-react"

interface WithdrawalModalProps {
  currencies: Currency[]
  paymentMethods: PaymentMethod[]
  balances: WalletBalance[]
}

export function WithdrawalModal({ currencies, paymentMethods, balances }: WithdrawalModalProps) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState("")
  const [selectedCurrency, setSelectedCurrency] = useState("")
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("")
  const [withdrawalAddress, setWithdrawalAddress] = useState("")
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const walletService = WalletService.getInstance()

  const getPaymentMethodIcon = (type: PaymentMethod["type"]) => {
    switch (type) {
      case "card":
        return <CreditCard className="h-4 w-4" />
      case "mobile_money":
        return <Smartphone className="h-4 w-4" />
      case "bank_transfer":
        return <Building className="h-4 w-4" />
      case "crypto":
        return <Bitcoin className="h-4 w-4" />
      case "qr_code":
        return <QrCode className="h-4 w-4" />
      case "voucher":
        return <Receipt className="h-4 w-4" />
      default:
        return <DollarSign className="h-4 w-4" />
    }
  }

  const handleWithdrawal = async () => {
    if (!user || !amount || !selectedCurrency || !selectedPaymentMethod) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      })
      return
    }

    const numAmount = Number.parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال مبلغ صحيح",
        variant: "destructive",
      })
      return
    }

    // Check available balance
    const balance = balances.find((b) => b.currencyId === selectedCurrency)
    if (!balance || balance.availableBalance < numAmount) {
      toast({
        title: "خطأ",
        description: "الرصيد غير كافي",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      await walletService.createTransaction(user.uid, {
        type: "withdrawal",
        status: "pending",
        amount: -numAmount,
        currencyId: selectedCurrency,
        fee: 0,
        description: `سحب عبر ${paymentMethods.find((p) => p.id === selectedPaymentMethod)?.name}`,
        paymentMethod: selectedPaymentMethod,
        toAddress: withdrawalAddress,
      })

      toast({
        title: "نجح",
        description: "تم إرسال طلب السحب بنجاح. سيتم المعالجة خلال دقائق قليلة.",
      })

      setOpen(false)
      setAmount("")
      setSelectedCurrency("")
      setSelectedPaymentMethod("")
      setWithdrawalAddress("")
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message || "فشل في معالجة طلب السحب",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const selectedMethod = paymentMethods.find((p) => p.id === selectedPaymentMethod)
  const selectedCurrencyData = currencies.find((c) => c.id === selectedCurrency)
  const selectedBalance = balances.find((b) => b.currencyId === selectedCurrency)
  const calculatedFee =
    selectedMethod && selectedCurrencyData
      ? Math.max(selectedMethod.fees.fixed, ((Number.parseFloat(amount) || 0) * selectedMethod.fees.percentage) / 100)
      : 0

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
          <ArrowUpRight className="h-4 w-4" />
          <span>سحب</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>سحب الأموال</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="currency">العملة</Label>
            <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
              <SelectTrigger>
                <SelectValue placeholder="اختر العملة" />
              </SelectTrigger>
              <SelectContent>
                {currencies
                  .filter((currency) => balances.some((b) => b.currencyId === currency.id && b.availableBalance > 0))
                  .map((currency) => {
                    const balance = balances.find((b) => b.currencyId === currency.id)
                    return (
                      <SelectItem key={currency.id} value={currency.id}>
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center space-x-2">
                            <span>{currency.symbol}</span>
                            <span>{currency.name}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {balance?.availableBalance.toFixed(currency.decimals)}
                          </span>
                        </div>
                      </SelectItem>
                    )
                  })}
              </SelectContent>
            </Select>
            {selectedBalance && (
              <p className="text-sm text-muted-foreground">
                الرصيد المتاح: {selectedBalance.availableBalance.toFixed(selectedCurrencyData?.decimals || 2)}{" "}
                {selectedCurrencyData?.symbol}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">المبلغ</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              max={selectedBalance?.availableBalance || 0}
              step="0.01"
            />
            {selectedBalance && Number.parseFloat(amount) > selectedBalance.availableBalance && (
              <div className="flex items-center space-x-2 text-red-500 text-sm">
                <AlertTriangle className="h-4 w-4" />
                <span>المبلغ يتجاوز الرصيد المتاح</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>طريقة السحب</Label>
            <div className="grid grid-cols-1 gap-2">
              {paymentMethods
                .filter((method) => !selectedCurrency || method.supportedCurrencies.includes(selectedCurrency))
                .map((method) => (
                  <Card
                    key={method.id}
                    className={`cursor-pointer transition-colors ${
                      selectedPaymentMethod === method.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            {getPaymentMethodIcon(method.type)}
                          </div>
                          <div>
                            <p className="font-medium">{method.name}</p>
                            <p className="text-sm text-muted-foreground">{method.provider}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {method.processingTime}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {method.fees.percentage}% + ${method.fees.fixed}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>

          {selectedMethod && (selectedMethod.type === "crypto" || selectedMethod.type === "bank_transfer") && (
            <div className="space-y-2">
              <Label htmlFor="address">{selectedMethod.type === "crypto" ? "عنوان المحفظة" : "رقم الحساب"}</Label>
              <Input
                id="address"
                placeholder={selectedMethod.type === "crypto" ? "أدخل عنوان المحفظة" : "أدخل رقم الحساب"}
                value={withdrawalAddress}
                onChange={(e) => setWithdrawalAddress(e.target.value)}
              />
            </div>
          )}

          {selectedMethod && selectedCurrencyData && amount && (
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>المبلغ:</span>
                    <span>
                      {amount} {selectedCurrencyData.symbol}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>الرسوم:</span>
                    <span>
                      {calculatedFee.toFixed(selectedCurrencyData.decimals)} {selectedCurrencyData.symbol}
                    </span>
                  </div>
                  <div className="flex justify-between font-medium border-t pt-2">
                    <span>المبلغ المستلم:</span>
                    <span>
                      {(Number.parseFloat(amount) - calculatedFee).toFixed(selectedCurrencyData.decimals)}{" "}
                      {selectedCurrencyData.symbol}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Button
            onClick={handleWithdrawal}
            disabled={
              loading ||
              !amount ||
              !selectedCurrency ||
              !selectedPaymentMethod ||
              (selectedBalance && Number.parseFloat(amount) > selectedBalance.availableBalance) ||
              ((selectedMethod?.type === "crypto" || selectedMethod?.type === "bank_transfer") && !withdrawalAddress)
            }
            className="w-full"
          >
            {loading ? "جاري المعالجة..." : "سحب الأموال"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
