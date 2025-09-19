import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, XCircle, ArrowUpRight, ArrowDownLeft } from "lucide-react"

interface Transaction {
  id: number
  type: "send" | "receive"
  amount: number
  currency: string
  recipient?: string
  sender?: string
  status: "completed" | "pending" | "failed"
  date: string
}

interface TransactionItemProps {
  transaction: Transaction
}

export function TransactionItem({ transaction }: TransactionItemProps) {
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
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center gap-4">
        <div
          className={`p-2 rounded-full ${
            transaction.type === "send" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
          }`}
        >
          {transaction.type === "send" ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}
        </div>
        <div>
          <div className="font-medium">
            {transaction.type === "send" ? `إلى ${transaction.recipient}` : `من ${transaction.sender}`}
          </div>
          <div className="text-sm text-muted-foreground">{transaction.date}</div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className={`font-medium ${transaction.type === "send" ? "text-red-600" : "text-green-600"}`}>
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
  )
}
