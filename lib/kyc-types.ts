export interface KYCDocument {
  id: string
  userId: string
  type: "passport" | "national_id" | "driver_license" | "utility_bill" | "bank_statement"
  status: "pending" | "approved" | "rejected" | "expired"
  uploadedAt: Date
  reviewedAt?: Date
  reviewedBy?: string
  rejectionReason?: string
  fileUrl: string
  fileName: string
  fileSize: number
  expiryDate?: Date
}

export interface KYCProfile {
  id: string
  userId: string
  status: "incomplete" | "pending" | "approved" | "rejected" | "suspended"
  level: "basic" | "intermediate" | "advanced"
  personalInfo: {
    firstName: string
    lastName: string
    dateOfBirth: Date
    nationality: string
    address: {
      street: string
      city: string
      state: string
      country: string
      postalCode: string
    }
    phoneNumber: string
    occupation: string
    sourceOfFunds: string
  }
  documents: KYCDocument[]
  riskScore: number
  complianceFlags: string[]
  lastUpdated: Date
  approvedAt?: Date
  approvedBy?: string
}

export interface ComplianceAlert {
  id: string
  userId: string
  type: "aml" | "sanctions" | "pep" | "high_risk" | "suspicious_activity"
  severity: "low" | "medium" | "high" | "critical"
  description: string
  status: "open" | "investigating" | "resolved" | "false_positive"
  createdAt: Date
  assignedTo?: string
  resolvedAt?: Date
  notes: string[]
}
