"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, MoreHorizontal, Eye, Ban, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import type { UserManagement } from "@/lib/admin-types"

const mockUsers: UserManagement[] = [
  {
    id: "1",
    email: "john.doe@example.com",
    displayName: "John Doe",
    status: "active",
    kycStatus: "approved",
    accountType: "individual",
    registrationDate: new Date("2024-01-15"),
    lastActivity: new Date("2024-03-10"),
    totalBalance: 15420.5,
    transactionCount: 127,
    riskScore: 2,
  },
  {
    id: "2",
    email: "jane.smith@business.com",
    displayName: "Jane Smith",
    status: "active",
    kycStatus: "pending",
    accountType: "business",
    registrationDate: new Date("2024-02-20"),
    lastActivity: new Date("2024-03-09"),
    totalBalance: 89750.25,
    transactionCount: 45,
    riskScore: 1,
  },
  {
    id: "3",
    email: "suspicious.user@temp.com",
    displayName: "Suspicious User",
    status: "suspended",
    kycStatus: "rejected",
    accountType: "individual",
    registrationDate: new Date("2024-03-01"),
    lastActivity: new Date("2024-03-05"),
    totalBalance: 0,
    transactionCount: 3,
    riskScore: 8,
  },
  {
    id: "4",
    email: "alice.johnson@example.com",
    displayName: "Alice Johnson",
    status: "pending_verification",
    kycStatus: "not_started",
    accountType: "individual",
    registrationDate: new Date("2024-03-08"),
    lastActivity: new Date("2024-03-08"),
    totalBalance: 250.0,
    transactionCount: 1,
    riskScore: 3,
  },
]

export function UserManagementTable() {
  const [users, setUsers] = useState(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredUsers, setFilteredUsers] = useState(mockUsers)

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    const filtered = users.filter(
      (user) =>
        user.email.toLowerCase().includes(term.toLowerCase()) ||
        user.displayName.toLowerCase().includes(term.toLowerCase()),
    )
    setFilteredUsers(filtered)
  }

  const getStatusBadge = (status: UserManagement["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        )
      case "suspended":
        return (
          <Badge variant="destructive">
            <Ban className="h-3 w-3 mr-1" />
            Suspended
          </Badge>
        )
      case "banned":
        return (
          <Badge variant="destructive" className="bg-red-600">
            <XCircle className="h-3 w-3 mr-1" />
            Banned
          </Badge>
        )
      case "pending_verification":
        return (
          <Badge variant="secondary">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getKycBadge = (status: UserManagement["kycStatus"]) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      case "not_started":
        return <Badge variant="outline">Not Started</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getRiskBadge = (score: number) => {
    if (score <= 3) return <Badge className="bg-green-500">Low</Badge>
    if (score <= 6) return <Badge className="bg-yellow-500">Medium</Badge>
    return <Badge variant="destructive">High</Badge>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>User Management</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>KYC</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Transactions</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead>Last Activity</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" alt={user.displayName} />
                      <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{user.displayName}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell>{getKycBadge(user.kycStatus)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {user.accountType}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">${user.totalBalance.toLocaleString()}</TableCell>
                <TableCell>{user.transactionCount}</TableCell>
                <TableCell>{getRiskBadge(user.riskScore)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {user.lastActivity.toLocaleDateString()}
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
                        Approve KYC
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Ban className="mr-2 h-4 w-4" />
                        Suspend User
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
