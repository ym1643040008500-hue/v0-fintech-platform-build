"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { collection, getDocs, doc, updateDoc, getDoc } from "firebase/firestore"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TransactionsAdmin() {
  const [transactions, setTransactions] = useState<any[]>([])

  const loadData = async () => {
    const snap = await getDocs(collection(db, "transactions"))
    setTransactions(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  }

  useEffect(() => {
    loadData()
  }, [])

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    const ref = doc(db, "transactions", id)
    const snap = await getDoc(ref)
    const tx = snap.data()

    if (!tx) return

    // ✅ تعديل الحالة
    await updateDoc(ref, { status })

    // ✅ لو موافقة، نعدل رصيد المستخدم
    if (status === "approved") {
      const userRef = doc(db, "users", tx.userId)
      const userSnap = await getDoc(userRef)
      if (userSnap.exists()) {
        const currentBalance = userSnap.data().balance || 0
        let newBalance = currentBalance

        if (tx.type === "deposit") {
          newBalance = currentBalance + tx.amount
        } else if (tx.type === "withdraw") {
          newBalance = currentBalance - tx.amount
        }

        await updateDoc(userRef, { balance: newBalance })
      }
    }

    loadData()
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>إدارة العمليات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex justify-between items-center border p-3 rounded-lg">
                <div>
                  <p>{tx.type === "deposit" ? "إيداع" : "سحب"} - {tx.amount}$ ({tx.method})</p>
                  <p className="text-xs">{tx.transactionId}</p>
                  <p className="text-xs">الحالة: {tx.status}</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => updateStatus(tx.id, "approved")}>موافقة</Button>
                  <Button variant="destructive" onClick={() => updateStatus(tx.id, "rejected")}>رفض</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
