"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, TrendingDown, Users, DollarSign, Activity, Target, Download, Calendar } from "lucide-react"

const revenueData = [
  { month: "Jan", revenue: 45000, transactions: 1200, users: 850 },
  { month: "Feb", revenue: 52000, transactions: 1450, users: 920 },
  { month: "Mar", revenue: 48000, transactions: 1350, users: 890 },
  { month: "Apr", revenue: 61000, transactions: 1680, users: 1100 },
  { month: "May", revenue: 55000, transactions: 1520, users: 980 },
  { month: "Jun", revenue: 67000, transactions: 1850, users: 1250 },
  { month: "Jul", revenue: 72000, transactions: 1980, users: 1350 },
  { month: "Aug", revenue: 69000, transactions: 1890, users: 1280 },
  { month: "Sep", revenue: 78000, transactions: 2150, users: 1450 },
  { month: "Oct", revenue: 82000, transactions: 2280, users: 1520 },
  { month: "Nov", revenue: 85000, transactions: 2350, users: 1580 },
  { month: "Dec", revenue: 91000, transactions: 2500, users: 1650 },
]

const userGrowthData = [
  { month: "Jan", newUsers: 120, activeUsers: 850, churnRate: 5.2 },
  { month: "Feb", newUsers: 145, activeUsers: 920, churnRate: 4.8 },
  { month: "Mar", newUsers: 98, activeUsers: 890, churnRate: 6.1 },
  { month: "Apr", newUsers: 210, activeUsers: 1100, churnRate: 3.9 },
  { month: "May", newUsers: 165, activeUsers: 980, churnRate: 5.5 },
  { month: "Jun", newUsers: 280, activeUsers: 1250, churnRate: 3.2 },
  { month: "Jul", newUsers: 195, activeUsers: 1350, churnRate: 4.1 },
  { month: "Aug", newUsers: 175, activeUsers: 1280, churnRate: 4.7 },
  { month: "Sep", newUsers: 220, activeUsers: 1450, churnRate: 3.8 },
  { month: "Oct", newUsers: 185, activeUsers: 1520, churnRate: 4.2 },
  { month: "Nov", newUsers: 165, activeUsers: 1580, churnRate: 4.5 },
  { month: "Dec", newUsers: 195, activeUsers: 1650, churnRate: 3.9 },
]

const transactionTypeData = [
  { name: "Deposits", value: 35, color: "#8884d8" },
  { name: "Withdrawals", value: 25, color: "#82ca9d" },
  { name: "Trading", value: 30, color: "#ffc658" },
  { name: "Marketplace", value: 10, color: "#ff7300" },
]

const geographicData = [
  { country: "United States", users: 450, revenue: 28500 },
  { country: "United Kingdom", users: 320, revenue: 19800 },
  { country: "Germany", users: 280, revenue: 17200 },
  { country: "Canada", users: 220, revenue: 13600 },
  { country: "Australia", users: 180, revenue: 11100 },
  { country: "France", users: 160, revenue: 9800 },
  { country: "Others", users: 240, revenue: 14800 },
]

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("12m")
  const [selectedMetric, setSelectedMetric] = useState("revenue")

  const kpiData = [
    {
      title: "Total Revenue",
      value: "$847,000",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      description: "vs last month",
    },
    {
      title: "Active Users",
      value: "1,650",
      change: "+8.2%",
      trend: "up",
      icon: Users,
      description: "vs last month",
    },
    {
      title: "Total Transactions",
      value: "2,500",
      change: "+6.4%",
      trend: "up",
      icon: Activity,
      description: "vs last month",
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      change: "-0.3%",
      trend: "down",
      icon: Target,
      description: "vs last month",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Comprehensive business intelligence and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="3m">Last 3 months</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {kpi.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span className={kpi.trend === "up" ? "text-green-500" : "text-red-500"}>{kpi.change}</span>
                <span>{kpi.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="geography">Geography</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue and growth patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]} />
                    <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Transaction Distribution</CardTitle>
                <CardDescription>Breakdown by transaction type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={transactionTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {transactionTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Key performance indicators over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="transactions" stroke="#82ca9d" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="users" stroke="#ffc658" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>New user acquisition and retention</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="newUsers" fill="#8884d8" name="New Users" />
                    <Bar dataKey="activeUsers" fill="#82ca9d" name="Active Users" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Churn Rate</CardTitle>
                <CardDescription>User retention and churn analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, "Churn Rate"]} />
                    <Line type="monotone" dataKey="churnRate" stroke="#ff7300" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>User Segmentation</CardTitle>
              <CardDescription>User behavior and engagement patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">High Value Users</span>
                    <Badge variant="secondary">15%</Badge>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "15%" }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Regular Users</span>
                    <Badge variant="secondary">65%</Badge>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "65%" }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Inactive Users</span>
                    <Badge variant="secondary">20%</Badge>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "20%" }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Volume</CardTitle>
                <CardDescription>Daily transaction processing</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="transactions" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Transaction Value</CardTitle>
                <CardDescription>Transaction size trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Deposits</span>
                    <div className="text-right">
                      <div className="font-bold">$2,450</div>
                      <div className="text-xs text-green-500">+5.2%</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Withdrawals</span>
                    <div className="text-right">
                      <div className="font-bold">$1,890</div>
                      <div className="text-xs text-red-500">-2.1%</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Trading</span>
                    <div className="text-right">
                      <div className="font-bold">$850</div>
                      <div className="text-xs text-green-500">+8.7%</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Marketplace</span>
                    <div className="text-right">
                      <div className="font-bold">$320</div>
                      <div className="text-xs text-green-500">+12.3%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="geography" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>User base and revenue by country</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={geographicData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="country" type="category" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="users" fill="#8884d8" name="Users" />
                  <Bar dataKey="revenue" fill="#82ca9d" name="Revenue ($)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Financial Reports</CardTitle>
                <CardDescription>Revenue and financial analytics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Calendar className="h-4 w-4 mr-2" />
                  Monthly Revenue Report
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Calendar className="h-4 w-4 mr-2" />
                  Quarterly Financial Summary
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Calendar className="h-4 w-4 mr-2" />
                  Annual Performance Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Reports</CardTitle>
                <CardDescription>User analytics and behavior</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Users className="h-4 w-4 mr-2" />
                  User Growth Analysis
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Users className="h-4 w-4 mr-2" />
                  Churn Analysis Report
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Users className="h-4 w-4 mr-2" />
                  User Segmentation Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Transaction Reports</CardTitle>
                <CardDescription>Transaction analytics and trends</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Activity className="h-4 w-4 mr-2" />
                  Transaction Volume Report
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Activity className="h-4 w-4 mr-2" />
                  Payment Method Analysis
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Activity className="h-4 w-4 mr-2" />
                  Fraud Detection Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
