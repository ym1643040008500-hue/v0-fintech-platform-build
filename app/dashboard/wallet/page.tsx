"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { db } from "@/lib/firebase"
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock4, Shield } from "lucide-react"

// طرق دفع تجريبية — تقدر تعدلها
const paymentMethods = [
  { id: "instapay", name: "InstaPay", fee: 0.5, minAmount: 10 },
  { id: "vodafone", name: "Vodafone Cash", fee: 1, minAmount: 50 },
  { id: "paypal", name: "PayPal", fee: 2, minAmount: 20 },
]

export default function WalletPage() {
  const [tab, setTab] = useState<"deposit" | "withdraw">("deposit")
  const [selectedMethod, setSelectedMethod] = useState("instapay")
  const [amount, setAmount] = useState("")
  const [transactionId, setTransactionId] = useState("")
  const [transactions, setTransactions] = useState<any[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const numericAmount = parseFloat(amount) || 0
  const method = paymentMethods.find((m) => m.id === selectedMethod)
  const fee = method ? (numericAmount * method.fee) / 100 : 0
  const finalAmount = tab === "deposit" ? numericAmount + fee : numericAmount - fee

  // ✅ fetch سجل العمليات
  useEffect(() => {
    const fetchData = async () => {
      const snap = await getDocs(collection(db, "transactions"))
      setTransactions(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    }
    fetchData()
  }, [])

  // ✅ handle submit
  const handleSubmit = async () => {
    if (!method || numericAmount < method.minAmount || !transactionId) return

    setIsProcessing(true)
    try {
      await addDoc(collection(db, "transactions"), {
        type: tab,
        method: selectedMethod,
        amount: numericAmount,
        transactionId,
        fee,
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
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* ✅ الرصيد */}
        <Card className="bg-[#111418] border-gray-800">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">رصيدك الحالي</p>
              <p className="text-2xl font-bold text-white">$0</p>
            </div>
            <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-400/30">
              <Shield className="w-3 h-3 ml-1" /> محمي
            </Badge>
          </CardContent>
        </Card>

        {/* ✅ Tabs */}
        <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
          <TabsList className="grid grid-cols-2 w-full bg-white/10 rounded-lg">
            <TabsTrigger value="deposit">إيداع</TabsTrigger>
            <TabsTrigger value="withdraw">سحب</TabsTrigger>
          </TabsList>

          <TabsContent value="deposit">
            <Card className="bg-[#111418] border-gray-800">
              <CardHeader>
                <CardTitle>إيداع الأموال</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Label>اختر وسيلة الدفع</Label>
                <select
                  className="w-full bg-black text-white p-2 rounded"
                  value={selectedMethod}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                >
                  {paymentMethods.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>

                <Label>المبلغ</Label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="ادخل المبلغ"
                />

                <Label>رقم العملية / Transaction ID</Label>
                <Input
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="ادخل رقم العملية بعد التحويل"
                />

                <p className="text-sm text-gray-400">الرسوم: ${fee.toFixed(2)} — المبلغ النهائي: ${finalAmount.toFixed(2)}</p>

                <Button onClick={handleSubmit} disabled={isProcessing}>
                  {isProcessing ? "جاري المعالجة..." : "تأكيد الإيداع"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="withdraw">
            <Card className="bg-[#111418] border-gray-800">
              <CardHeader>
                <CardTitle>سحب الأموال</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Label>اختر وسيلة السحب</Label>
                <select
                  className="w-full bg-black text-white p-2 rounded"
                  value={selectedMethod}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                >
                  {paymentMethods.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>

                <Label>المبلغ</Label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="ادخل المبلغ"
                />

                <Label>رقم العملية / Transaction ID</Label>
                <Input
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="ادخل رقم الحساب أو المعرف"
                />

                <p className="text-sm text-gray-400">الرسوم: ${fee.toFixed(2)} — المبلغ النهائي: ${finalAmount.toFixed(2)}</p>

                <Button onClick={handleSubmit} disabled={isProcessing}>
                  {isProcessing ? "جاري المعالجة..." : "تأكيد السحب"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* ✅ سجل العمليات */}
        <Card className="bg-[#111418] border-gray-800">
          <CardHeader>
            <CardTitle>سجل العمليات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {transactions.length === 0 ? (
              <p className="text-gray-400 text-sm">لا يوجد عمليات بعد</p>
            ) : (
              transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-3">
                    {tx.status === "pending" ? (
                      <Clock4 className="w-5 h-5 text-yellow-400" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    )}
                    <div>
                      <p className="text-white text-sm">{paymentMethods.find((m) => m.id === tx.method)?.name}</p>
                      <p className="text-gray-400 text-xs">{tx.transactionId}</p>
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
    </DashboardLayout>
  )
}
