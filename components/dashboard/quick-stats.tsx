"use client"

import { useState, useEffect, ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, TrendingUp, ArrowUpRight, Clock } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"

// ✅ DashboardLayout داخل نفس الملف
function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B0E11] text-white">
      <aside className="w-64 bg-[#111418] border-r border-gray-800 fixed h-full p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-8">لوحة التحكم</h2>
        <nav className="flex flex-col space-y-4">
          <a href="/dashboard" className="hover:text-yellow-400">الرئيسية</a>
          <a href="/dashboard/wallet" className="hover:text-yellow-400">المحفظة</a>
          <a href="/dashboard/profile" className="hover:text-yellow-400">الحساب</a>
          <a href="/dashboard/settings" className="hover:text-yellow-400">الإعدادات</a>
        </nav>
      </aside>
      <main className="ml-64 flex-1 p-8">{children}</main>
    </div>
  )
}

// ✅ QuickStats Component
function QuickStats({ currency = "جنيه" }: { currency?: string }) {
  const { user } = useAuth()
  const [stats, setStats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return
      try {
        const docRef = doc(db, "users", user.uid)
        const snap = await getDoc(docRef)
        if (snap.exists()) {
          const data = snap.data()
          const totalBalance = data.totalBalance ?? 0
          const todaysPL = data.todaysPL ?? 0
          const activePositions = data.activePositions ?? 0
          const pendingOrders = data.pendingOrders ?? 0

          setStats([
            {
              title: "الرصيد الكلي",
              value: `${currency} ${totalBalance.toLocaleString()}`,
              change: "+200",
              changePercent: "+9.3%",
              icon: Wallet,
              trend: "up",
            },
            {
              title: "أرباح اليوم",
              value: `${todaysPL >= 0 ? "+" : ""}${currency} ${todaysPL.toLocaleString()}`,
              change: "مقارنة بالبارحة",
              changePercent: "+2.1%",
              icon: TrendingUp,
              trend: todaysPL >= 0 ? "up" : "down",
            },
            {
              title: "المراكز النشطة",
              value: activePositions,
              change: "مركز مفتوح",
              changePercent: "",
              icon: ArrowUpRight,
              trend: "up",
            },
            {
              title: "الأوامر المعلقة",
              value: pendingOrders,
              change: "أوامر محددة",
              changePercent: "",
              icon: Clock,
              trend: "neutral",
            },
          ])
        }
      } catch (err) {
        console.error("Error fetching stats:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [user])

  if (loading) return <p>Loading stats...</p>
  if (!stats.length) return <p>No stats available</p>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">{stat.change}</span>
                    {stat.changePercent && (
                      <Badge
                        variant={
                          stat.trend === "up"
                            ? "default"
                            : stat.trend === "down"
                            ? "destructive"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {stat.changePercent}
                      </Badge>
                    )}
                  </div>
                </div>
                <div
                  className={`p-3 rounded-lg ${
                    stat.trend === "up"
                      ? "bg-green-500/10 text-green-500"
                      : stat.trend === "down"
                      ? "bg-red-500/10 text-red-500"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

// ✅ الصفحة الرئيسية Dashboard
export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* رأس الصفحة */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-white">لوحة التحكم</h1>
          <p className="text-gray-400 mt-2 text-lg">
            نظرة عامة على المحفظة والحسابات والإحصائيات الخاصة بك
          </p>
        </header>

        {/* QuickStats */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-white">إحصائيات سريعة</h2>
          <QuickStats currency="جنيه" />
        </section>

        {/* الأنشطة الأخيرة */}
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-white">الأنشطة الأخيرة</h2>
          <div className="bg-[#111418] border border-gray-800 rounded-lg p-6 text-white">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-2">العملية</th>
                  <th className="py-2">المبلغ</th>
                  <th className="py-2">التاريخ</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-800">
                  <td className="py-2">إيداع</td>
                  <td className="py-2">جنيه 500</td>
                  <td className="py-2">2025-09-28</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-2">سحب</td>
                  <td className="py-2">جنيه 200</td>
                  <td className="py-2">2025-09-27</td>
                </tr>
                <tr>
                  <td className="py-2">شراء سهم</td>
                  <td className="py-2">جنيه 1000</td>
                  <td className="py-2">2025-09-26</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}
