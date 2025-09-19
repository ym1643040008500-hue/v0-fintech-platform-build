"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/hooks/use-auth"
import {
  TrendingUp,
  Wallet,
  BarChart3,
  ShoppingCart,
  Settings,
  Shield,
  FileText,
  CreditCard,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Home,
  Activity,
  Zap,
} from "lucide-react"

interface SidebarProps {
  collapsed?: boolean
  onToggle?: () => void
}

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const { logout } = useAuth()

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
      current: pathname === "/dashboard",
    },
    {
      name: "Wallet",
      href: "/dashboard/wallet",
      icon: Wallet,
      current: pathname === "/dashboard/wallet",
      badge: "3",
    },
    {
      name: "Trading",
      href: "/dashboard/trading",
      icon: TrendingUp,
      current: pathname === "/dashboard/trading",
    },
    {
      name: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart3,
      current: pathname === "/dashboard/analytics",
    },
    {
      name: "Marketplace",
      href: "/dashboard/marketplace",
      icon: ShoppingCart,
      current: pathname === "/dashboard/marketplace",
      badge: "New",
    },
  ]

  const secondaryNavigation = [
    {
      name: "Payments",
      href: "/dashboard/payments",
      icon: CreditCard,
      current: pathname === "/dashboard/payments",
    },
    {
      name: "Activity",
      href: "/dashboard/activity",
      icon: Activity,
      current: pathname === "/dashboard/activity",
    },
    {
      name: "API & Integrations",
      href: "/dashboard/integrations",
      icon: Zap,
      current: pathname === "/dashboard/integrations",
    },
  ]

  const bottomNavigation = [
    {
      name: "Compliance",
      href: "/dashboard/compliance",
      icon: Shield,
      current: pathname === "/dashboard/compliance",
    },
    {
      name: "Reports",
      href: "/dashboard/reports",
      icon: FileText,
      current: pathname === "/dashboard/reports",
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
      current: pathname === "/dashboard/settings",
    },
    {
      name: "Help",
      href: "/dashboard/help",
      icon: HelpCircle,
      current: pathname === "/dashboard/help",
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
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-sidebar-foreground">FinTech Pro</span>
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
              <p className="px-3 text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider mb-2">Tools</p>
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
