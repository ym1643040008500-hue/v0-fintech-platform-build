"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/hooks/use-auth"
import {
  Users,
  CreditCard,
  Shield,
  AlertTriangle,
  Settings,
  BarChart3,
  FileText,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Home,
  Activity,
  Eye,
  Gavel,
  DollarSign,
} from "lucide-react"

interface AdminSidebarProps {
  collapsed?: boolean
  onToggle?: () => void
}

export function AdminSidebar({ collapsed = false, onToggle }: AdminSidebarProps) {
  const pathname = usePathname()
  const { logout } = useAuth()

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: Home,
      current: pathname === "/admin",
    },
    {
      name: "User Management",
      href: "/admin/users",
      icon: Users,
      current: pathname === "/admin/users",
      badge: "1,234",
    },
    {
      name: "Currencies",
      href: "/admin/currencies",
      icon: DollarSign,
      current: pathname === "/admin/currencies",
    },
    {
      name: "Transactions",
      href: "/admin/transactions",
      icon: CreditCard,
      current: pathname === "/admin/transactions",
      badge: "45",
    },
    {
      name: "KYC Reviews",
      href: "/admin/kyc",
      icon: Shield,
      current: pathname === "/admin/kyc",
      badge: "12",
    },
    {
      name: "Alerts",
      href: "/admin/alerts",
      icon: AlertTriangle,
      current: pathname === "/admin/alerts",
      badge: "8",
    },
  ]

  const secondaryNavigation = [
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
      current: pathname === "/admin/analytics",
    },
    {
      name: "Audit Logs",
      href: "/admin/audit",
      icon: Activity,
      current: pathname === "/admin/audit",
    },
    {
      name: "Compliance",
      href: "/admin/compliance",
      icon: Gavel,
      current: pathname === "/admin/compliance",
    },
    {
      name: "Monitoring",
      href: "/admin/monitoring",
      icon: Eye,
      current: pathname === "/admin/monitoring",
    },
  ]

  const bottomNavigation = [
    {
      name: "Reports",
      href: "/admin/reports",
      icon: FileText,
      current: pathname === "/admin/reports",
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
      current: pathname === "/admin/settings",
    },
    {
      name: "Help",
      href: "/admin/help",
      icon: HelpCircle,
      current: pathname === "/admin/help",
    },
  ]

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <div
      className={`flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-sidebar-foreground">Admin Panel</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {/* Primary Navigation */}
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={item.current ? "default" : "ghost"}
                    className={`w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent ${
                      collapsed ? "px-2" : "px-3"
                    } ${item.current ? "bg-sidebar-primary text-sidebar-primary-foreground" : ""}`}
                  >
                    <Icon className={`h-4 w-4 ${collapsed ? "" : "mr-3"}`} />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left">{item.name}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="ml-auto text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </Button>
                </Link>
              )
            })}
          </div>

          {!collapsed && <Separator className="my-4 bg-sidebar-border" />}

          {/* Secondary Navigation */}
          <div className="space-y-1">
            {!collapsed && (
              <p className="px-3 text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider mb-2">
                Operations
              </p>
            )}
            {secondaryNavigation.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={item.current ? "default" : "ghost"}
                    className={`w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent ${
                      collapsed ? "px-2" : "px-3"
                    } ${item.current ? "bg-sidebar-primary text-sidebar-primary-foreground" : ""}`}
                  >
                    <Icon className={`h-4 w-4 ${collapsed ? "" : "mr-3"}`} />
                    {!collapsed && <span className="flex-1 text-left">{item.name}</span>}
                  </Button>
                </Link>
              )
            })}
          </div>
        </nav>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-sidebar-border p-3">
        <nav className="space-y-1">
          {bottomNavigation.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={item.current ? "default" : "ghost"}
                  className={`w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent ${
                    collapsed ? "px-2" : "px-3"
                  } ${item.current ? "bg-sidebar-primary text-sidebar-primary-foreground" : ""}`}
                >
                  <Icon className={`h-4 w-4 ${collapsed ? "" : "mr-3"}`} />
                  {!collapsed && <span className="flex-1 text-left">{item.name}</span>}
                </Button>
              </Link>
            )
          })}
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={`w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent ${
              collapsed ? "px-2" : "px-3"
            }`}
          >
            <LogOut className={`h-4 w-4 ${collapsed ? "" : "mr-3"}`} />
            {!collapsed && <span className="flex-1 text-left">Logout</span>}
          </Button>
        </nav>
      </div>
    </div>
  )
}
