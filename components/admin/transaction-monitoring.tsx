"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, AlertTriangle, CheckCircle, XCircle, Eye, Flag } from "lucide-react"
import type { AdminTransaction } from "@/lib/admin-types"

const mockTransactions: AdminTransaction[] = [
  {
    id: "tx_001",
    userId: "user_123",
    userEmail: "john.doe@example.com",
    type: "withdrawal",
    amount: 50000,
    currency: "USD",
    status: "flagged",
    flagReason: "Large amount withdrawal",
    createdAt: new Date("2024-03-10T10:30:00"),
    updatedAt: new Date("2024-03-10T10:30:00"),
    riskScore: 8,
  },
  {
    id: "tx_002",
    userId: "user_456",
    userEmail: "jane.smith@business.com",
    type: "deposit",
    amount: 25000,
    currency: "USD",
    status: "completed",
    createdAt: new Date("2024-03-10T09:15:00"),
    updatedAt: new Date("2024-03-10T09:20:00"),
    riskScore: 2,
  },
  {
    id: "tx_003",
    userId: "user_789",
    userEmail: "suspicious.user@temp.com",
    type: "transfer",
    amount: 15000,
    currency: "USD",
    status: "flagged",
    flagReason: "Suspicious pattern detected",
    createdAt: new Date("2024-03-10T08:45:00"),
    updatedAt: new Date("2024-03-10T08:45:00"),
    riskScore: 9,
  },
  {
    id: "tx_004",
    userId: "user_101",
    userEmail: "alice.johnson@example.com",
    type: "trade",
    amount: 5000,
    currency: "USD",
    status: "pending",
    createdAt: new Date("2024-03-10T07:20:00"),
    updatedAt: new Date("2024-03-10T07:20:00"),
    riskScore: 3,
  },
]

export function TransactionMonitoring() {
  const [transactions] = useState(mockTransactions)

  const getStatusBadge = (status: AdminTransaction["status"], flagReason?: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        )
      case "flagged":
        return (
          <Badge variant="destructive" className="bg-orange-500">
            <Flag className="h-3 w-3 mr-1" />
            Flagged
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getRiskBadge = (score: number) => {
    if (score <= 3) return <Badge className="bg-green-500">Low</Badge>
    if (score <= 6) return <Badge className="bg-yellow-500">Medium</Badge>
    return <Badge variant="destructive">High</Badge>
  }

  const getTypeBadge = (type: AdminTransaction["type"]) => {
    const colors = {
      deposit: "bg-green-500/10 text-green-500",
      withdrawal: "bg-red-500/10 text-red-500",
      transfer: "bg-blue-500/10 text-blue-500",
      trade: "bg-purple-500/10 text-purple-500",
      payment: "bg-orange-500/10 text-orange-500",
    }

    return (
      <Badge variant="outline" className={`capitalize ${colors[type]}`}>
        {type}
      </Badge>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Transaction Monitoring</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="destructive" className="bg-orange-500">
              {transactions.filter((t) => t.status === "flagged").length} Flagged
            </Badge>
            <Badge variant="secondary">{transactions.filter((t) => t.status === "pending").length} Pending</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id} className={transaction.status === "flagged" ? "bg-red-50/50" : ""}>
                <TableCell className="font-mono text-sm">{transaction.id}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-sm">{transaction.userEmail}</p>
                    <p className="text-xs text-muted-foreground">{transaction.userId}</p>
                  </div>
                </TableCell>
                <TableCell>{getTypeBadge(transaction.type)}</TableCell>
                <TableCell className="font-medium">
                  ${transaction.amount.toLocaleString()} {transaction.currency}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {getStatusBadge(transaction.status, transaction.flagReason)}
                    {transaction.flagReason && <p className="text-xs text-red-600">{transaction.flagReason}</p>}
                  </div>
                </TableCell>
                <TableCell>{getRiskBadge(transaction.riskScore)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {transaction.createdAt.toLocaleString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Flag className="mr-2 h-4 w-4" />
                        Flag for Review
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
