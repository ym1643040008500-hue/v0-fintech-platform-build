"use client"

import { useState } from "react"
import { KYCForm } from "@/components/kyc/kyc-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/hooks/use-auth"
import { CheckCircle, Clock, AlertCircle, FileText, Shield, Zap } from "lucide-react"

export default function KYCPage() {
  const { user } = useAuth()
  const [kycStatus] = useState<"incomplete" | "pending" | "approved" | "rejected">("incomplete")
  const [kycLevel] = useState<"basic" | "intermediate" | "advanced">("basic")

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "rejected":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "secondary"
      case "pending":
        return "default"
      case "rejected":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getLevelProgress = (level: string) => {
    switch (level) {
      case "basic":
        return 33
      case "intermediate":
        return 66
      case "advanced":
        return 100
      default:
        return 0
    }
  }

  const levelBenefits = {
    basic: ["Basic wallet functionality", "Limited transaction amounts", "Standard customer support"],
    intermediate: [
      "Increased transaction limits",
      "Access to trading features",
      "Priority customer support",
      "Advanced security features",
    ],
    advanced: [
      "Unlimited transaction amounts",
      "Full marketplace access",
      "Premium trading tools",
      "Dedicated account manager",
      "Institutional features",
    ],
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">KYC Verification</h1>
          <p className="text-muted-foreground">Complete your identity verification to unlock all platform features</p>
        </div>
        <div className="flex items-center gap-2">
          {getStatusIcon(kycStatus)}
          <Badge variant={getStatusColor(kycStatus)}>{kycStatus.charAt(0).toUpperCase() + kycStatus.slice(1)}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {kycStatus === "incomplete" && <KYCForm userId={user?.uid || ""} currentLevel={kycLevel} />}

          {kycStatus === "pending" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  Application Under Review
                </CardTitle>
                <CardDescription>Your KYC application is being reviewed by our compliance team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                  <p className="text-sm">
                    We're currently reviewing your submitted documents and information. This process typically takes
                    24-48 hours. You'll receive an email notification once the review is complete.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Submitted Documents:</h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4" />
                      <span>Government ID - Passport</span>
                      <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4" />
                      <span>Proof of Address - Utility Bill</span>
                      <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {kycStatus === "approved" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Verification Complete
                </CardTitle>
                <CardDescription>Your identity has been successfully verified</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <p className="text-sm">
                    Congratulations! Your KYC verification is complete. You now have access to all platform features
                    based on your verification level.
                  </p>
                </div>
                <Button className="w-full">Upgrade to Next Level</Button>
              </CardContent>
            </Card>
          )}

          {kycStatus === "rejected" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  Application Rejected
                </CardTitle>
                <CardDescription>Your KYC application requires additional information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <p className="text-sm mb-2">Your application was rejected for the following reasons:</p>
                  <ul className="text-sm space-y-1">
                    <li>• Document quality is insufficient</li>
                    <li>• Address verification required</li>
                  </ul>
                </div>
                <Button className="w-full">Resubmit Application</Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Verification Level</CardTitle>
              <CardDescription>Your current verification status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Current Level</span>
                  <span className="font-medium">{kycLevel.charAt(0).toUpperCase() + kycLevel.slice(1)}</span>
                </div>
                <Progress value={getLevelProgress(kycLevel)} className="w-full" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Basic Level</span>
                  {kycLevel === "basic" && <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />}
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Intermediate Level</span>
                  {kycLevel === "intermediate" && <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />}
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Advanced Level</span>
                  {kycLevel === "advanced" && <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Level Benefits</CardTitle>
              <CardDescription>Features available at your current level</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {levelBenefits[kycLevel].map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security & Privacy</CardTitle>
              <CardDescription>Your data protection information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-green-500" />
                <span>256-bit SSL encryption</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-green-500" />
                <span>GDPR compliant</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-green-500" />
                <span>SOC 2 Type II certified</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
