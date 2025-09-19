export interface AdminUser {
  id: string
  email: string
  displayName: string
  role: "super_admin" | "admin" | "moderator" | "support"
  permissions: string[]
  isActive: boolean
  lastLogin: Date
  createdAt: Date
}

export interface UserManagement {
  id: string
  email: string
  displayName: string
  status: "active" | "suspended" | "banned" | "pending_verification"
  kycStatus: "not_started" | "pending" | "approved" | "rejected"
  accountType: "individual" | "business"
  registrationDate: Date
  lastActivity: Date
  totalBalance: number
  transactionCount: number
  riskScore: number
}

export interface AdminTransaction {
  id: string
  userId: string
  userEmail: string
  type: "deposit" | "withdrawal" | "transfer" | "trade" | "payment"
  amount: number
  currency: string
  status: "pending" | "completed" | "failed" | "flagged"
  flagReason?: string
  createdAt: Date
  updatedAt: Date
  riskScore: number
}

export interface SystemAlert {
  id: string
  type: "security" | "compliance" | "system" | "user_activity"
  severity: "low" | "medium" | "high" | "critical"
  title: string
  description: string
  userId?: string
  transactionId?: string
  status: "new" | "investigating" | "resolved" | "dismissed"
  createdAt: Date
  resolvedAt?: Date
  assignedTo?: string
}

export interface PlatformSettings {
  id: string
  category: "fees" | "limits" | "security" | "features"
  key: string
  value: string | number | boolean
  description: string
  updatedBy: string
  updatedAt: Date
}
