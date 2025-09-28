"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp, getDocs } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Clock4, CheckCircle, Shield, Smartphone, Wallet, Globe, ArrowLeft } from "lucide-react"

// 🟢 طرق الدفع
const paymentMethods = [
  {
    id: "etisalat",
    name: "اتصالات كاش",
    icon: <Smartphone className="w-5 h-5 text-green-400" />,
    fee: 1.5,
    minAmount: 50,
    details: "رقم المحفظة: 01123456789\nالاسم: أحمد محمد",
  },
  {
    id: "vodafone",
    name: "فودافون كاش",
    icon: <Smartphone className="w-5 h-5 text-red-400" />,
    fee: 1.5,
    minAmount: 10,
    details: "رقم المحفظة: 01098765432\nالاسم: Vodafone User",
  },
  {
    id: "orange",
    name: "أورانج كاش",
    icon: <Smartphone className="w-5 h-5 text-orange-400" />,
    fee: 1.5,
    minAmount: 50,
    details: "رقم المحفظة: 01234567890\nالاسم: Orange Cash",
  },
  {
    id: "instapay",
    name: "InstaPay",
    icon: <Wallet className="w-5 h-5 text-blue-400" />,
    fee: 1.0,
    minAmount: 20,
    details: "InstaPay ID: user@bank.com\nالبنك: CIB",
  },
  {
    id: "paypal",
    name: "PayPal",
    icon: <Globe className="w-5 h-5 text-sky-400" />,
    fee: 2.5,
    minAmount: 10,
    details: "PayPal Email: yourbusiness@paypal.com",
  },
]

export default function WalletPage() {
  const { userProfile } = useAuth()
  const [tab, setTab] = useState<"deposit" | "withdraw">("deposit")
  const [selectedMethod, setSelectedMethod] = useState("etisalat")
  const [amount, setAmount] = useState("")
  const [transactionId, setTransactionId] = useState("")
  const [withdrawAccount, setWithdrawAccount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [history, setHistory] = useState<any[]>([])

  const methodObj = paymentMethods.find((m) => m.id === selectedMethod)
  const numericAmount = Number.parseFloat(amount) || 0
  const feeAmount = methodObj ? (numericAmount * methodObj.fee) / 100 : 0
  const totalAmount = tab === "deposit" ? numericAmount + feeAmount : numericAmount - feeAmount

  // تحميل السجل
  useEffect(() => {
    if (!userProfile?.uid) return
    const fetchData = async () => {
      const depositsSnap = await getDocs(collection(db, "deposits"))
      const withdrawSnap = await getDocs(collection(db, "withdrawals"))

      const deps = depositsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      const withs = withdrawSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

      setHistory([...deps, ...withs].filter((t: any) => t.userId === userProfile.uid))
    }
    fetchData()
  }, [userProfile])

  // إرسال الطلب
  const handleSubmit = async () => {
    if (!methodObj || numericAmount < methodObj.minAmount) return
    try {
      setIsProcessing(true)
      const target = tab === "deposit" ? "deposits" : "withdrawals"
      await addDoc(collection(db, target), {
        userId: userProfile?.uid,
        method: selectedMethod,
        amount: numericAmount,
        transactionId,
        withdrawAccount: tab === "withdraw" ? withdrawAccount : null,
        status: "pending",
        createdAt: serverTimestamp(),
      })
      setAmount("")
      setTransactionId("")
      setWithdrawAccount("")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* زر رجوع للصفحة الرئيسية */}
      <div className="flex justify-start">
        <Link href="/dashboard">
          <Button variant="outline" className="flex items-center gap-2 border-white/30 text-white hover:bg-white/10">
            <ArrowLeft className="w-4 h-4" />
            <span>الصفحة الرئيسية</span>
          </Button>
        </Link>
      </div>

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

        {/* إيداع / سحب */}
        <TabsContent value={tab}>
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-white">{tab === "deposit" ? "إيداع الأموال" : "سحب الأموال"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* اختيار وسيلة الدفع */}
              <div>
                <Label className="text-white">اختر وسيلة الدفع</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {paymentMethods.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => setSelectedMethod(m.id)}
                      className={`cursor-pointer p-3 rounded-lg border flex items-center gap-2 
                      ${selectedMethod === m.id ? "bg-white/20 border-green-400" : "bg-white/5 border-white/20"}`}
                    >
                      {m.icon}
                      <span className="text-white text-sm">{m.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* تفاصيل الدفع أو خانة السحب */}
              {tab === "deposit" && methodObj && (
                <div className="p-3 bg-white/5 rounded border border-white/10 text-white text-sm whitespace-pre-line">
                  <strong>تفاصيل الدفع:</strong>
                  <p className="mt-1">{methodObj.details}</p>
                </div>
              )}
              {tab === "withdraw" && (
                <div>
                  <Label className="text-white">اكتب رقم المحفظة/الحساب لسحب الأموال</Label>
                  <Input value={withdrawAccount} onChange={(e) => setWithdrawAccount(e.target.value)} placeholder="مثال: 01012345678" />
                </div>
              )}

              {/* المبلغ */}
              <div>
                <Label className="text-white">المبلغ</Label>
                <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
                {methodObj && (
                  <p className="text-xs text-white/60 mt-1">
                    الحد الأدنى: {methodObj.minAmount} ج.م — رسوم: {methodObj.fee}% — الإجمالي: {totalAmount} ج.م
                  </p>
                )}
              </div>

              {/* Transaction ID (فقط عند الإيداع) */}
              {tab === "deposit" && (
                <div>
                  <Label className="text-white">Transaction ID</Label>
                  <Input value={transactionId} onChange={(e) => setTransactionId(e.target.value)} />
                </div>
              )}

              {/* زر */}
              <Button disabled={isProcessing} onClick={handleSubmit} className="w-full">
                {isProcessing ? "جارٍ المعالجة..." : tab === "deposit" ? "تأكيد الإيداع" : "تأكيد السحب"}
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
          {history.length === 0 ? (
            <p className="text-white/60 text-sm">لا يوجد عمليات بعد</p>
          ) : (
            history.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-3">
                  {tx.status === "pending" ? (
                    <Clock4 className="w-5 h-5 text-yellow-400" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  )}
                  <div>
                    <p className="text-white text-sm">{paymentMethods.find((m) => m.id === tx.method)?.name || tx.method}</p>
                    <p className="text-white/60 text-xs">{tx.transactionId || tx.withdrawAccount}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">{tx.amount} ج.م</p>
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
