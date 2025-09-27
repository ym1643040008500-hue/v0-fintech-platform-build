"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp, getDocs } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Clock4, CheckCircle, Shield } from "lucide-react"
import { paymentMethods } from "@/lib/payment-methods"

export default function WalletPage() {
  const { userProfile } = useAuth()
  const [tab, setTab] = useState<"deposit" | "withdraw">("deposit")
  const [selectedMethod, setSelectedMethod] = useState("paypal")
  const [amount, setAmount] = useState("")
  const [transactionId, setTransactionId] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [deposits, setDeposits] = useState<any[]>([])
  const [withdrawals, setWithdrawals] = useState<any[]>([])

  const selectedPaymentMethod = paymentMethods.find((m) => m.id === selectedMethod)
  const numericAmount = Number.parseFloat(amount) || 0
  const feeAmount = selectedPaymentMethod ? (numericAmount * selectedPaymentMethod.fee) / 100 : 0
  const totalAmount = tab === "deposit" ? numericAmount + feeAmount : numericAmount - feeAmount

  // 🔹 load history
  useEffect(() => {
    if (!userProfile?.uid) return
    const fetchData = async () => {
      const depSnap = await getDocs(collection(db, "deposits"))
      const deps = depSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((d: any) => d.userId === userProfile.uid)

      const withSnap = await getDocs(collection(db, "withdrawals"))
      const withs = withSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((d: any) => d.userId === userProfile.uid)

      setDeposits(deps)
      setWithdrawals(withs)
    }
    fetchData()
  }, [userProfile])

  // 🔹 handle submit
  const handleSubmit = async () => {
    if (!selectedPaymentMethod || numericAmount < selectedPaymentMethod.minAmount || !transactionId) return
    try {
      setIsProcessing(true)
      const target = tab === "deposit" ? "deposits" : "withdrawals"
      await addDoc(collection(db, target), {
        userId: userProfile?.uid,
        method: selectedMethod,
        amount: numericAmount,
        transactionId,
        status: "pending",
        createdAt: serverTimestamp(),
      })
      setAmount("")
      setTransactionId("")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* الرصيد */}
      <Card className="glass-card border-white/20">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-white/70">رصيدك الحالي</p>
            <p className="text-2xl font-bold text-white">${userProfile?.balance?.toLocaleString() || 0}</p>
          </div>
          <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-400/30">
            <Shield className="w-3 h-3 ml-1" /> محمي
          </Badge>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as "deposit" | "withdraw")}>
        <TabsList className="grid grid-cols-2 w-full bg-white/10 rounded-lg">
          <TabsTrigger value="deposit">إيداع</TabsTrigger>
          <TabsTrigger value="withdraw">سحب</TabsTrigger>
        </TabsList>

        {/* إيداع */}
        <TabsContent value="deposit">
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-white">إيداع الأموال</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white">اختر وسيلة الدفع</Label>
                <select
                  className="w-full p-2 rounded bg-white/10 text-white"
                  value={selectedMethod}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                >
                  {paymentMethods.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-white">المبلغ</Label>
                <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
              </div>
              <div>
                <Label className="text-white">Transaction ID</Label>
                <Input value={transactionId} onChange={(e) => setTransactionId(e.target.value)} />
              </div>
              <Button disabled={isProcessing} onClick={handleSubmit}>
                {isProcessing ? "جارٍ المعالجة..." : "تأكيد الإيداع"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* سحب */}
        <TabsContent value="withdraw">
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-white">سحب الأموال</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white">اختر وسيلة الدفع</Label>
                <select
                  className="w-full p-2 rounded bg-white/10 text-white"
                  value={selectedMethod}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                >
                  {paymentMethods.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-white">المبلغ</Label>
                <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
              </div>
              <div>
                <Label className="text-white">Transaction ID</Label>
                <Input value={transactionId} onChange={(e) => setTransactionId(e.target.value)} />
              </div>
              <Button disabled={isProcessing} onClick={handleSubmit}>
                {isProcessing ? "جارٍ المعالجة..." : "تأكيد السحب"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* سجل العمليات */}
      <Card className="glass-card border-white/20">
        <CardHeader>
          <CardTitle className="text-white">سجل العمليات</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[...deposits, ...withdrawals].length === 0 ? (
            <p className="text-white/60 text-sm">لا يوجد عمليات بعد</p>
          ) : (
            [...deposits, ...withdrawals].map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-3">
                  {tx.status === "pending" ? (
                    <Clock4 className="w-5 h-5 text-yellow-400" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  )}
                  <div>
                    <p className="text-white text-sm">{paymentMethods.find((m) => m.id === tx.method)?.name || tx.method}</p>
                    <p className="text-white/60 text-xs">{tx.transactionId}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">${tx.amount}</p>
                  <p className={`text-xs ${tx.status === "pending" ? "text-yellow-400" : "text-green-400"}`}>
                    {tx.status === "pending" ? "قيد المراجعة" : "مكتمل"}
                  </p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
