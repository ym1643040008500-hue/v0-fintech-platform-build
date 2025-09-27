"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ArrowRight, Shield, Clock, CheckCircle, Clock4 } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp, getDocs } from "firebase/firestore"
import BottomNav from "@/components/BottomNav"

// نفس المصفوفة بتاعت طرق الدفع عندك
import { paymentMethods } from "@/lib/payment-methods"

export default function WalletPage() {
  const { userProfile } = useAuth()
  const [tab, setTab] = useState<"deposit" | "withdraw">("deposit")

  // 🔹 State عام
  const [selectedMethod, setSelectedMethod] = useState("paypal")
  const [amount, setAmount] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [instapayAddress, setInstapayAddress] = useState("")
  const [transactionId, setTransactionId] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  // 🔹 السجلات
  const [deposits, setDeposits] = useState<any[]>([])
  const [withdrawals, setWithdrawals] = useState<any[]>([])

  const selectedPaymentMethod = paymentMethods.find((m) => m.id === selectedMethod)
  const numericAmount = Number.parseFloat(amount) || 0
  const feeAmount = selectedPaymentMethod ? (numericAmount * selectedPaymentMethod.fee) / 100 : 0
  const totalAmount = tab === "deposit" ? numericAmount + feeAmount : numericAmount - feeAmount

  // ✅ fetch history
  useEffect(() => {
    if (!userProfile?.uid) return

    const fetchData = async () => {
      const depSnap = await getDocs(collection(db, "deposits"))
      const deps = depSnap.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((d: any) => d.userId === userProfile.uid)

      const withSnap = await getDocs(collection(db, "withdrawals"))
      const withs = withSnap.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((d: any) => d.userId === userProfile.uid)

      setDeposits(deps)
      setWithdrawals(withs)
    }

    fetchData()
  }, [userProfile])

  // ✅ handle deposit / withdraw
  const handleSubmit = async () => {
    if (!selectedPaymentMethod || numericAmount < selectedPaymentMethod.minAmount || !transactionId) return

    try {
      setIsProcessing(true)
      const target = tab === "deposit" ? "deposits" : "withdrawals"

      await addDoc(collection(db, target), {
        userId: userProfile?.uid,
        method: selectedMethod,
        amount: numericAmount,
        phoneNumber:
          selectedMethod === "etisalat" || selectedMethod === "vodafone" || selectedMethod === "fawry"
            ? phoneNumber
            : null,
        instapayAddress: selectedMethod === "instapay" ? instapayAddress : null,
        transactionId,
        status: "pending",
        createdAt: serverTimestamp(),
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-5xl mx-auto p-6 pb-20 space-y-6">
          {/* رصيد */}
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

            {/* Deposit */}
            <TabsContent value="deposit">
              {/* نفس واجهة الإيداع بتاعتك */}
            </TabsContent>

            {/* Withdraw */}
            <TabsContent value="withdraw">
              {/* نسخة طبق الأصل من الإيداع بس تغير العناوين والـ collection */}
            </TabsContent>
          </Tabs>

          {/* ✅ سجل العمليات */}
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
                        <p className="text-white text-sm">
                          {paymentMethods.find((m) => m.id === tx.method)?.name || tx.method}
                        </p>
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

        <BottomNav />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
