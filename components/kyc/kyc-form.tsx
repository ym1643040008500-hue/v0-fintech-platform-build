"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { Upload, FileText, CheckCircle, Clock } from "lucide-react"

interface KYCFormProps {
  userId: string
  currentLevel?: "basic" | "intermediate" | "advanced"
}

export function KYCForm({ userId, currentLevel = "basic" }: KYCFormProps) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    nationality: "",
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },
    phoneNumber: "",
    occupation: "",
    sourceOfFunds: "",
  })
  const [documents, setDocuments] = useState<File[]>([])
  const { toast } = useToast()

  const totalSteps = 3
  const progress = (step / totalSteps) * 100

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "KYC Application Submitted",
        description: "Your application is under review. You'll be notified within 24-48 hours.",
      })

      if (step < totalSteps) {
        setStep(step + 1)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit KYC application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setDocuments((prev) => [...prev, ...files])
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="nationality">Nationality</Label>
                <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, nationality: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select nationality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="UK">United Kingdom</SelectItem>
                    <SelectItem value="CA">Canada</SelectItem>
                    <SelectItem value="AU">Australia</SelectItem>
                    <SelectItem value="DE">Germany</SelectItem>
                    <SelectItem value="FR">France</SelectItem>
                    <SelectItem value="EG">Egypt</SelectItem>
                    <SelectItem value="AE">UAE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                required
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                value={formData.address.street}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    address: { ...prev.address, street: e.target.value },
                  }))
                }
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.address.city}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      address: { ...prev.address, city: e.target.value },
                    }))
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State/Province</Label>
                <Input
                  id="state"
                  value={formData.address.state}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      address: { ...prev.address, state: e.target.value },
                    }))
                  }
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country">Country</Label>
                <Select
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      address: { ...prev.address, country: value },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="UK">United Kingdom</SelectItem>
                    <SelectItem value="CA">Canada</SelectItem>
                    <SelectItem value="AU">Australia</SelectItem>
                    <SelectItem value="DE">Germany</SelectItem>
                    <SelectItem value="FR">France</SelectItem>
                    <SelectItem value="EG">Egypt</SelectItem>
                    <SelectItem value="AE">UAE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  value={formData.address.postalCode}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      address: { ...prev.address, postalCode: e.target.value },
                    }))
                  }
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  id="occupation"
                  value={formData.occupation}
                  onChange={(e) => setFormData((prev) => ({ ...prev, occupation: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="sourceOfFunds">Source of Funds</Label>
                <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, sourceOfFunds: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employment">Employment</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="investment">Investment</SelectItem>
                    <SelectItem value="inheritance">Inheritance</SelectItem>
                    <SelectItem value="savings">Savings</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label>Upload Documents</Label>
              <div className="mt-2 border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Upload your identity documents (passport, national ID, driver's license)
                  </p>
                  <p className="text-xs text-muted-foreground">Supported formats: JPG, PNG, PDF (max 10MB each)</p>
                </div>
                <input
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="document-upload"
                />
                <Label htmlFor="document-upload" className="cursor-pointer">
                  <Button type="button" variant="outline" className="mt-4 bg-transparent">
                    Choose Files
                  </Button>
                </Label>
              </div>
            </div>

            {documents.length > 0 && (
              <div className="space-y-2">
                <Label>Uploaded Documents</Label>
                {documents.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 border rounded">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">{file.name}</span>
                    <Badge variant="secondary" className="ml-auto">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </Badge>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Required Documents:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Government-issued photo ID (passport, national ID, or driver's license)</li>
                <li>• Proof of address (utility bill, bank statement, or rental agreement)</li>
                <li>• Additional documents may be required based on your profile</li>
              </ul>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>KYC Verification</CardTitle>
            <CardDescription>Complete your identity verification to unlock all platform features</CardDescription>
          </div>
          <Badge variant={currentLevel === "basic" ? "secondary" : "default"}>
            {currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)} Level
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-4 mb-6">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    stepNumber < step
                      ? "bg-primary border-primary text-primary-foreground"
                      : stepNumber === step
                        ? "border-primary text-primary"
                        : "border-muted text-muted-foreground"
                  }`}
                >
                  {stepNumber < step ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : stepNumber === step ? (
                    <Clock className="h-4 w-4" />
                  ) : (
                    stepNumber
                  )}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-12 h-0.5 mx-2 ${stepNumber < step ? "bg-primary" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>

          {renderStep()}

          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
            >
              Previous
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Processing..." : step === totalSteps ? "Submit Application" : "Next"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
