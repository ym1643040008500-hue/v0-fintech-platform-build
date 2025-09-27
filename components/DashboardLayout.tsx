"use client"

import { ReactNode } from "react"

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B0E11] text-white">
      {/* ✅ Sidebar */}
      <aside className="w-64 bg-[#111418] border-r border-gray-800 fixed h-full p-4">
        <h2 className="text-xl font-bold mb-6">لوحة التحكم</h2>
        <nav className="flex flex-col space-y-3">
          <a href="/dashboard" className="hover:text-yellow-400">الرئيسية</a>
          <a href="/dashboard/wallet" className="hover:text-yellow-400">المحفظة</a>
          <a href="/dashboard/profile" className="hover:text-yellow-400">الحساب</a>
          <a href="/dashboard/settings" className="hover:text-yellow-400">الإعدادات</a>
        </nav>
      </aside>

      {/* ✅ Main Content */}
      <main className="ml-64 flex-1 p-6">
        {children}
      </main>
    </div>
  )
}
