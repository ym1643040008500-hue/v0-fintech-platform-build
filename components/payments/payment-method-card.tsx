"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { LucideIcon } from "lucide-react"

interface PaymentMethodCardProps {
  id: string
  name: string
  icon: LucideIcon
  fee: string
  isSelected: boolean
  onClick: () => void
}

export function PaymentMethodCard({ id, name, icon: Icon, fee, isSelected, onClick }: PaymentMethodCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-colors ${isSelected ? "border-primary bg-primary/5" : "hover:bg-muted/50"}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5" />
            <span className="font-medium">{name}</span>
          </div>
          <Badge variant="outline">رسوم {fee}</Badge>
        </div>
      </CardContent>
    </Card>
  )
}
