"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { db } from "@/lib/firebase"
import { collection, addDoc, query, where, orderBy, onSnapshot } from "firebase/firestore"
import {
  CreditCard,
  Banknote,
  Smartphone,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react"

export default function PaymentsPage() {
  const { user } = useAuth()
  const [selectedMethod, setSelectedMethod] = useState("")
  const [amount, setAmount] = useState("")
  const [recipient, setRecipient] = useState("")
  const [currency, setCurrency] = useState("")
  const [transactions, setTransactions] = useState<any[]>([])

  const paymentMethods = [
    { id: "card", name: "بطاقة ائتمان", icon: CreditCard, fee: "2.9%" },
    { id: "bank", name: "تحويل بنكي", icon: Banknote, fee: "1.5%" },
    { id: "mobile", name: "محفظة موبايل", icon: Smartphone, fee: "1.0%" },
  ]

  // 🔹 جلب سجل معاملات المستخدم
  useEffect(() => {
    if (!user) return
    const q = query(
      collection(db, "transactions"),
      where("participants", "array-contains", user.uid),
      orderBy("date", "desc")
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTransactions(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    })

    return () => unsubscribe()
  }, [user])

  const handleSendPayment = async () => {
    if (!selectedMethod || !amount || !recipient || !currency) {
      alert("يرجى ملء جميع الحقول المطلوبة")
      return
    }

    try {
      await addDoc(collection(db, "transactions"), {
        type: "send",
        amount: Number(amount),
        currency,
        from: user?.uid,
        to: recipient,
        participants: [user?.uid, recipient], // علشان نقدر نجيبها للطرفين
        status: "pending",
        method: selectedMethod,
        date: new Date().toISOString(),
      })

      setAmount("")
      setRecipient("")
      setCurrency("")
      setSelectedMethod("")
      alert("✅ تم إرسال المعاملة بنجاح (قيد المعالجة)")
    } catch (err) {
      console.error("Error sending payment:", err)
      alert("❌ فشل إرسال الدفع")
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "default",
      pending: "secondary",
      failed: "destructive",
    } as const

    const labels = {
      completed: "مكتمل",
      pending: "قيد المعالجة",
      failed: "فشل",
    }

    return <Badge variant={variants[status as keyof typeof variants]}>{labels[status as keyof typeof labels]}</Badge>
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">المدفوعات</h1>
          <p className="text-muted-foreground">إدارة المدفوعات والتحويلات المالية</p>
        </div>
      </div>

      <Tabs defaultValue="send" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="send">إرسال أموال</TabsTrigger>
          <TabsTrigger value="request">طلب أموال</TabsTrigger>
          <TabsTrigger value="history">سجل المعاملات</TabsTrigger>
        </TabsList>

        {/* إرسال أموال */}
        <TabsContent value="send" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>إرسال أموال</CardTitle>
                <CardDescription>اختر طريقة الدفع وأدخل تفاصيل التحويل</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recipient">المستلم</Label>
                  <Input
                    id="recipient"
                    placeholder="User ID للمستلم"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">المبلغ</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>العملة</Label>
                  <Select onValueChange={(val) => setCurrency(val)} value={currency}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر العملة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">دولار أمريكي (USD)</SelectItem>
                      <SelectItem value="EUR">يورو (EUR)</SelectItem>
                      <SelectItem value="GBP">جنيه إسترليني (GBP)</SelectItem>
                      <SelectItem value="AED">درهم إماراتي (AED)</SelectItem>
                      <SelectItem value="SAR">ريال سعودي (SAR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleSendPayment} className="w-full">
                  إرسال الأموال
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>طرق الدفع</CardTitle>
                <CardDescription>اختر طريقة الدفع المفضلة</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedMethod === method.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedMethod(method.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <method.icon className="h-5 w-5" />
                        <span className="font-medium">{method.name}</span>
                      </div>
                      <Badge variant="outline">رسوم {method.fee}</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* سجل المعاملات */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>سجل المعاملات</CardTitle>
              <CardDescription>جميع معاملاتك المالية الحديثة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.length === 0 && <p className="text-muted-foreground">لا توجد معاملات بعد</p>}
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2 rounded-full ${
                          transaction.type === "send" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                        }`}
                      >
                        {transaction.type === "send" ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownLeft className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">
                          {transaction.type === "send"
                            ? `إلى ${transaction.to}`
                            : `من ${transaction.from}`}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(transaction.date).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div
                          className={`font-medium ${
                            transaction.type === "send" ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          {transaction.type === "send" ? "-" : "+"}
                          {transaction.amount} {transaction.currency}
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(transaction.status)}
                          {getStatusBadge(transaction.status)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
