"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, CheckCircle, Clock, Search, Eye, FileText, Shield } from "lucide-react"

const mockAlerts = [
  {
    id: "1",
    userId: "user_123",
    userName: "John Doe",
    type: "aml",
    severity: "high",
    description: "Multiple large transactions detected within 24 hours",
    status: "open",
    createdAt: new Date("2024-01-15"),
    assignedTo: "compliance_officer_1",
  },
  {
    id: "2",
    userId: "user_456",
    userName: "Jane Smith",
    type: "sanctions",
    severity: "critical",
    description: "Name match found on sanctions list",
    status: "investigating",
    createdAt: new Date("2024-01-14"),
    assignedTo: "compliance_officer_2",
  },
  {
    id: "3",
    userId: "user_789",
    userName: "Bob Johnson",
    type: "pep",
    severity: "medium",
    description: "Politically Exposed Person (PEP) identified",
    status: "resolved",
    createdAt: new Date("2024-01-13"),
    assignedTo: "compliance_officer_1",
  },
]

const mockKYCApplications = [
  {
    id: "1",
    userId: "user_101",
    userName: "Alice Brown",
    status: "pending",
    level: "intermediate",
    submittedAt: new Date("2024-01-15"),
    riskScore: 25,
    documentsCount: 3,
  },
  {
    id: "2",
    userId: "user_102",
    userName: "Charlie Wilson",
    status: "approved",
    level: "advanced",
    submittedAt: new Date("2024-01-14"),
    riskScore: 15,
    documentsCount: 5,
  },
  {
    id: "3",
    userId: "user_103",
    userName: "Diana Davis",
    status: "rejected",
    level: "basic",
    submittedAt: new Date("2024-01-13"),
    riskScore: 85,
    documentsCount: 2,
  },
]

export function ComplianceDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [severityFilter, setSeverityFilter] = useState("all")

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "destructive"
      case "investigating":
        return "default"
      case "resolved":
        return "secondary"
      case "false_positive":
        return "secondary"
      case "pending":
        return "default"
      case "approved":
        return "secondary"
      case "rejected":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertTriangle className="h-4 w-4" />
      case "investigating":
        return <Clock className="h-4 w-4" />
      case "resolved":
        return <CheckCircle className="h-4 w-4" />
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "rejected":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending KYC</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">-5 from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk Users</CardTitle>
            <Shield className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">+1 from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">+2% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="alerts">Compliance Alerts</TabsTrigger>
          <TabsTrigger value="kyc">KYC Applications</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Alerts</CardTitle>
              <CardDescription>Monitor and manage compliance alerts and suspicious activities</CardDescription>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search alerts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="investigating">Investigating</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severity</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAlerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell className="font-medium">{alert.userName}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="uppercase">
                          {alert.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(alert.status)}
                          <Badge variant={getStatusColor(alert.status)}>{alert.status}</Badge>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{alert.description}</TableCell>
                      <TableCell>{alert.createdAt.toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kyc" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>KYC Applications</CardTitle>
              <CardDescription>Review and manage KYC verification applications</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Risk Score</TableHead>
                    <TableHead>Documents</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockKYCApplications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell className="font-medium">{application.userName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{application.level}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(application.status)}
                          <Badge variant={getStatusColor(application.status)}>{application.status}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              application.riskScore > 70
                                ? "bg-red-500"
                                : application.riskScore > 40
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                            }`}
                          />
                          {application.riskScore}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          {application.documentsCount}
                        </div>
                      </TableCell>
                      <TableCell>{application.submittedAt.toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {application.status === "pending" && (
                            <>
                              <Button variant="ghost" size="sm" className="text-green-600">
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600">
                                <AlertTriangle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Reports</CardTitle>
                <CardDescription>Generate regulatory compliance reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  AML Transaction Report
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  KYC Status Report
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Risk Assessment Report
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Sanctions Screening Report
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Regulatory Updates</CardTitle>
                <CardDescription>Latest compliance requirements and updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-sm">New AML guidelines effective Jan 2024</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-sm">Updated sanctions list published</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-sm">Enhanced KYC requirements for crypto</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
