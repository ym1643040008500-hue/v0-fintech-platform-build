"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowUpRight,
  ArrowDownLeft,
  Send,
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  TrendingUp,
} from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, query, orderBy, onSnapshot } from "firebase/firestore"
import { useAuth } from "@/hooks/use-auth"

export function RecentActivity() {
  const { user } = useAuth()
  const [activities, setActivities] = useState<any[]>([])

  useEffect(() => {
    if (!user) return
    const q = query(
      collection(db, "users", user.uid, "transactions"),
      orderBy("createdAt", "desc")
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      setActivities(data)
    })

    return () => unsubscribe()
  }, [user])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
      case "processing":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="default" className="text-xs">Completed</Badge>
      case "pending":
        return <Badge variant="secondary" className="text-xs">Pending</Badge>
      case "processing":
        return <Badge variant="secondary" className="text-xs">Processing</Badge>
      case "failed":
        return <Badge variant="destructive" className="text-xs">Failed</Badge>
      default:
        return <Badge variant="secondary" className="text-xs">{status}</Badge>
    }
  }

  const getIconByType = (type: string) => {
    switch (type) {
      case "deposit": return ArrowDownLeft
      case "trade": return TrendingUp
      case "transfer": return Send
      case "marketplace": return ShoppingCart
      case "withdrawal": return ArrowUpRight
      default: return Clock
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = getIconByType(activity.type)
            const isPositive = activity.amount > 0

            return (
              <div
                key={activity.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    {getStatusIcon(activity.status)}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date(activity.createdAt).toLocaleString()}
                      </span>
                      {getStatusBadge(activity.status)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${isPositive ? "text-green-500" : "text-foreground"}`}>
                    {isPositive ? "+" : "-"}${Math.abs(activity.amount)}
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.currency}</p>
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" className="w-full bg-transparent">
            View All Activity
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
