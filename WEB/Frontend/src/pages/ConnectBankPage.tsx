"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Lock, Shield, CheckCircle, ArrowRight, Building2, Loader2 } from "lucide-react"

// Type for bank information
interface BankInfo {
  bankName: string
  branchName: string
  accountHolderName: string
  accountNumber: string
  accountType: string
  balance: string
}

// Type for form data
interface FormData {
  bankName: string
  accountNumber: string
  confirmAccountNumber: string
  ifscCode: string
  accountHolderName: string
}

// Type for verification result
type VerificationResult =
  | { success: true; data: BankInfo }
  | { success: false; error: string }
  | null

export default function ConnectBankPage() {
  const [isElderMode, setIsElderMode] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState("en")
  const [currentStep, setCurrentStep] = useState(1)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<VerificationResult>(null)
  const [formData, setFormData] = useState<FormData>({
    bankName: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
    accountHolderName: "",
  })

  const bankData: Record<string, BankInfo> = {
    SBIN0001234: {
      bankName: "State Bank of India",
      branchName: "Main Branch, Mumbai",
      accountHolderName: "John Doe",
      accountNumber: "1234567890123456",
      accountType: "Savings Account",
      balance: "₹1,25,000",
    },
    HDFC0000123: {
      bankName: "HDFC Bank",
      branchName: "Bandra West, Mumbai",
      accountHolderName: "Jane Smith",
      accountNumber: "9876543210987654",
      accountType: "Current Account",
      balance: "₹2,50,000",
    },
    ICIC0001234: {
      bankName: "ICICI Bank",
      branchName: "Andheri East, Mumbai",
      accountHolderName: "Mike Johnson",
      accountNumber: "5555666677778888",
      accountType: "Savings Account",
      balance: "₹75,000",
    },
  }

  const banks: string[] = [
    "State Bank of India",
    "HDFC Bank",
    "ICICI Bank",
    "Axis Bank",
    "Punjab National Bank",
    "Bank of Baroda",
    "Canara Bank",
    "Union Bank of India",
  ]

  const steps = [
    { number: 1, title: "Bank Details", description: "Enter your bank information" },
    { number: 2, title: "Verification", description: "Verify your account details" },
    { number: 3, title: "Security", description: "Set up security preferences" },
  ]

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const simulateBankVerification = async () => {
    setIsVerifying(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const bankInfo = bankData[formData.ifscCode]

    if (bankInfo && formData.accountNumber === bankInfo.accountNumber) {
      setVerificationResult({
        success: true,
        data: bankInfo,
      })
    } else {
      setVerificationResult({
        success: false,
        error: "Account details could not be verified. Please check your IFSC code and account number.",
      })
    }

    setIsVerifying(false)
  }

  const handleNextStep = async () => {
    if (currentStep === 1) {
      // Validate form before proceeding
      if (!formData.bankName || !formData.accountNumber || !formData.ifscCode || !formData.accountHolderName) {
        alert("Please fill in all required fields")
        return
      }

      if (formData.accountNumber !== formData.confirmAccountNumber) {
        alert("Account numbers do not match")
        return
      }

      await simulateBankVerification()
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setVerificationResult(null)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-gradient-to-br from-background to-muted/20 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="bg-primary/10 p-4 rounded-full">
                <Building2 className={`text-primary ${isElderMode ? "h-16 w-16" : "h-12 w-12"}`} />
              </div>
            </div>
            <h1 className={`font-bold text-foreground mb-4 ${isElderMode ? "text-5xl" : "text-3xl md:text-4xl"}`}>
              Connect Your Bank Account
            </h1>
            <p className={`text-muted-foreground max-w-2xl mx-auto ${isElderMode ? "text-xl" : "text-lg"}`}>
              Securely link your bank account to start using SafePay's advanced features
            </p>
          </div>

          {/* Step Indicator */}
          <div className="mb-12">
            <div className="flex justify-center">
              <div className="flex items-center space-x-4">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                          currentStep >= step.number
                            ? "bg-primary border-primary text-primary-foreground"
                            : "border-border text-muted-foreground"
                        } ${isElderMode ? "w-16 h-16 text-lg" : ""}`}
                      >
                        {currentStep > step.number ? (
                          <CheckCircle className={isElderMode ? "h-8 w-8" : "h-5 w-5"} />
                        ) : (
                          step.number
                        )}
                      </div>
                      <div className="mt-2 text-center">
                        <div className={`font-medium text-foreground ${isElderMode ? "text-lg" : "text-sm"}`}>
                          {step.title}
                        </div>
                        <div className={`text-muted-foreground ${isElderMode ? "text-base" : "text-xs"}`}>
                          {step.description}
                        </div>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <ArrowRight className={`text-muted-foreground mx-4 ${isElderMode ? "h-6 w-6" : "h-4 w-4"}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Form Card */}
          <Card className="border-border shadow-lg bg-card/50 backdrop-blur">
            <CardHeader className={isElderMode ? "p-8" : ""}>
              <CardTitle className={`flex items-center gap-3 ${isElderMode ? "text-2xl" : "text-xl"}`}>
                <Lock className={`text-primary ${isElderMode ? "h-8 w-8" : "h-6 w-6"}`} />
                Step {currentStep}: {steps[currentStep - 1].title}
              </CardTitle>
            </CardHeader>
            <CardContent className={isElderMode ? "p-8 pt-0" : ""}>
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="bankName" className={isElderMode ? "text-lg" : ""}>
                        Select Your Bank *
                      </Label>
                      <Select value={formData.bankName} onValueChange={(value) => handleInputChange("bankName", value)}>
                        <SelectTrigger className={`${isElderMode ? "h-14 text-lg" : ""} bg-background/50`}>
                          <SelectValue placeholder="Choose your bank" />
                        </SelectTrigger>
                        <SelectContent>
                          {banks.map((bank) => (
                            <SelectItem key={bank} value={bank} className={isElderMode ? "text-lg py-3" : ""}>
                              {bank}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="accountHolderName" className={isElderMode ? "text-lg" : ""}>
                        Account Holder Name *
                      </Label>
                      <Input
                        id="accountHolderName"
                        value={formData.accountHolderName}
                        onChange={(e) => handleInputChange("accountHolderName", e.target.value)}
                        placeholder="Enter full name as per bank records"
                        className={`${isElderMode ? "h-14 text-lg" : ""} bg-background/50`}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber" className={isElderMode ? "text-lg" : ""}>
                        Account Number *
                      </Label>
                      <Input
                        id="accountNumber"
                        type="password"
                        value={formData.accountNumber}
                        onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                        placeholder="Enter your account number"
                        className={`${isElderMode ? "h-14 text-lg" : ""} bg-background/50`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmAccountNumber" className={isElderMode ? "text-lg" : ""}>
                        Confirm Account Number *
                      </Label>
                      <Input
                        id="confirmAccountNumber"
                        value={formData.confirmAccountNumber}
                        onChange={(e) => handleInputChange("confirmAccountNumber", e.target.value)}
                        placeholder="Re-enter your account number"
                        className={`${isElderMode ? "h-14 text-lg" : ""} bg-background/50`}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ifscCode" className={isElderMode ? "text-lg" : ""}>
                      IFSC Code *
                    </Label>
                    <Input
                      id="ifscCode"
                      value={formData.ifscCode}
                      onChange={(e) => handleInputChange("ifscCode", e.target.value.toUpperCase())}
                      placeholder="Enter IFSC code (e.g., SBIN0001234, HDFC0000123, ICIC0001234)"
                      className={`${isElderMode ? "h-14 text-lg" : ""} bg-background/50`}
                    />
                    <p className={`text-muted-foreground ${isElderMode ? "text-base" : "text-sm"}`}>
                      Try: SBIN0001234, HDFC0000123, or ICIC0001234 for demo
                    </p>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  {isVerifying ? (
                    <div className="text-center py-8">
                      <Loader2
                        className={`mx-auto animate-spin text-primary ${isElderMode ? "h-16 w-16" : "h-12 w-12"}`}
                      />
                      <p className={`mt-4 text-muted-foreground ${isElderMode ? "text-lg" : ""}`}>
                        Verifying your bank account details...
                      </p>
                    </div>
                  ) : verificationResult ? (
                    verificationResult.success ? (
                      <div className="space-y-4">
                        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
                          <div className="flex items-center mb-4">
                            <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                            <h3
                              className={`font-semibold text-green-800 dark:text-green-200 ${isElderMode ? "text-xl" : "text-lg"}`}
                            >
                              Account Verified Successfully!
                            </h3>
                          </div>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className={`text-muted-foreground ${isElderMode ? "text-lg" : ""}`}>Bank:</span>
                              <span className={`font-medium ${isElderMode ? "text-lg" : ""}`}>
                                {verificationResult.data.bankName}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className={`text-muted-foreground ${isElderMode ? "text-lg" : ""}`}>Branch:</span>
                              <span className={`font-medium ${isElderMode ? "text-lg" : ""}`}>
                                {verificationResult.data.branchName}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className={`text-muted-foreground ${isElderMode ? "text-lg" : ""}`}>
                                Account Holder:
                              </span>
                              <span className={`font-medium ${isElderMode ? "text-lg" : ""}`}>
                                {verificationResult.data.accountHolderName}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className={`text-muted-foreground ${isElderMode ? "text-lg" : ""}`}>
                                Account Type:
                              </span>
                              <span className={`font-medium ${isElderMode ? "text-lg" : ""}`}>
                                {verificationResult.data.accountType}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className={`text-muted-foreground ${isElderMode ? "text-lg" : ""}`}>
                                Available Balance:
                              </span>
                              <span className={`font-medium text-green-600 ${isElderMode ? "text-lg" : ""}`}>
                                {verificationResult.data.balance}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
                        <h3
                          className={`font-semibold text-red-800 dark:text-red-200 mb-2 ${isElderMode ? "text-xl" : "text-lg"}`}
                        >
                          Verification Failed
                        </h3>
                        <p className={`text-red-700 dark:text-red-300 ${isElderMode ? "text-lg" : ""}`}>
                          {verificationResult.error}
                        </p>
                      </div>
                    )
                  ) : (
                    <div className="bg-card p-6 rounded-lg border border-border">
                      <h3 className={`font-semibold text-foreground mb-4 ${isElderMode ? "text-xl" : "text-lg"}`}>
                        Please verify your details:
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className={`text-muted-foreground ${isElderMode ? "text-lg" : ""}`}>Bank:</span>
                          <span className={`font-medium ${isElderMode ? "text-lg" : ""}`}>{formData.bankName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={`text-muted-foreground ${isElderMode ? "text-lg" : ""}`}>
                            Account Holder:
                          </span>
                          <span className={`font-medium ${isElderMode ? "text-lg" : ""}`}>
                            {formData.accountHolderName}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className={`text-muted-foreground ${isElderMode ? "text-lg" : ""}`}>
                            Account Number:
                          </span>
                          <span className={`font-medium ${isElderMode ? "text-lg" : ""}`}>
                            ****{formData.accountNumber.slice(-4)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className={`text-muted-foreground ${isElderMode ? "text-lg" : ""}`}>IFSC Code:</span>
                          <span className={`font-medium ${isElderMode ? "text-lg" : ""}`}>{formData.ifscCode}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="bg-primary/10 p-6 rounded-full w-fit mx-auto mb-6">
                      <CheckCircle className={`text-primary ${isElderMode ? "h-16 w-16" : "h-12 w-12"}`} />
                    </div>
                    <h3 className={`font-semibold text-foreground mb-4 ${isElderMode ? "text-2xl" : "text-xl"}`}>
                      Account Connected Successfully!
                    </h3>
                    <p className={`text-muted-foreground mb-8 ${isElderMode ? "text-lg" : ""}`}>
                      Your bank account has been securely linked to SafePay. You can now start using all our features.
                    </p>
                  </div>
                </div>
              )}

              {/* Security Reassurance */}
              <div className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-start space-x-3">
                  <Shield className={`text-primary flex-shrink-0 mt-1 ${isElderMode ? "h-6 w-6" : "h-5 w-5"}`} />
                  <div>
                    <h4 className={`font-medium text-foreground mb-2 ${isElderMode ? "text-lg" : ""}`}>
                      Your data is secure
                    </h4>
                    <p className={`text-muted-foreground ${isElderMode ? "text-base" : "text-sm"}`}>
                      We use bank-grade 256-bit encryption to protect your information. Your account details are never
                      stored in plain text and are processed through secure, encrypted channels.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={handlePrevStep}
                  disabled={currentStep === 1}
                  size={isElderMode ? "lg" : "default"}
                  className={isElderMode ? "text-lg px-6" : ""}
                >
                  Previous
                </Button>
                <Button
                  onClick={currentStep === 3 ? () => (window.location.href = "/send-money") : handleNextStep}
                  size={isElderMode ? "lg" : "default"}
                  className={isElderMode ? "text-lg px-6" : ""}
                  disabled={isVerifying || (currentStep === 2 && verificationResult && !verificationResult.success)}
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : currentStep === 3 ? (
                    "Start Using SafePay"
                  ) : currentStep === 2 && !verificationResult ? (
                    "Verify Account"
                  ) : (
                    "Next Step"
                  )}
                  {!isVerifying && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
