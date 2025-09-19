"use client"

import { ComplianceDashboard } from "@/components/kyc/compliance-dashboard"

export default function AdminCompliancePage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Compliance Management</h1>
        <p className="text-muted-foreground">
          Monitor compliance alerts, manage KYC applications, and generate regulatory reports
        </p>
      </div>
      <ComplianceDashboard />
    </div>
  )
}
