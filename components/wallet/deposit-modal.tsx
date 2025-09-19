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
import type { PaymentMethod, Currency } from "@/lib/types"
import { Plus, CreditCard, Smartphone, Building, Bitcoin, QrCode, Receipt, Clock, DollarSign } from "lucide-react"

interface DepositModalProps {
  currencies: Currency[]
  paymentMethods: PaymentMethod[]
}

export function DepositModal({ currencies, paymentMethods }: DepositModalProps) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState("")
  const [selectedCurrency, setSelectedCurrency] = useState("")
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("")
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

  const handleDeposit = async () => {
    if (!user || !amount || !selectedCurrency || !selectedPaymentMethod) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const numAmount = Number.parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      await walletService.processPayment(user.uid, {
        amount: numAmount,
        currencyId: selectedCurrency,
        paymentMethodId: selectedPaymentMethod,
        description: `Deposit via ${paymentMethods.find((p) => p.id === selectedPaymentMethod)?.name}`,
      })

      toast({
        title: "Success",
        description: "Deposit initiated successfully. Processing may take a few minutes.",
      })

      setOpen(false)
      setAmount("")
      setSelectedCurrency("")
      setSelectedPaymentMethod("")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to process deposit",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const selectedMethod = paymentMethods.find((p) => p.id === selectedPaymentMethod)
  const selectedCurrencyData = currencies.find((c) => c.id === selectedCurrency)
  const calculatedFee =
    selectedMethod && selectedCurrencyData
      ? Math.max(selectedMethod.fees.fixed, ((Number.parseFloat(amount) || 0) * selectedMethod.fees.percentage) / 100)
      : 0

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Deposit</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Deposit Funds</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.id} value={currency.id}>
                    <div className="flex items-center space-x-2">
                      <span>{currency.symbol}</span>
                      <span>{currency.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label>Payment Method</Label>
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

          {selectedMethod && selectedCurrencyData && amount && (
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span>
                      {amount} {selectedCurrencyData.symbol}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fee:</span>
                    <span>
                      {calculatedFee.toFixed(selectedCurrencyData.decimals)} {selectedCurrencyData.symbol}
                    </span>
                  </div>
                  <div className="flex justify-between font-medium border-t pt-2">
                    <span>Total:</span>
                    <span>
                      {(Number.parseFloat(amount) + calculatedFee).toFixed(selectedCurrencyData.decimals)}{" "}
                      {selectedCurrencyData.symbol}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Button
            onClick={handleDeposit}
            disabled={loading || !amount || !selectedCurrency || !selectedPaymentMethod}
            className="w-full"
          >
            {loading ? "Processing..." : "Deposit Funds"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
