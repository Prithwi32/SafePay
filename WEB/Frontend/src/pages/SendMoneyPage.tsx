import { useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { VoiceConfirmationModal } from "../components/voice-confirmation-modal"
import { FraudAlert } from "../components/fraud-alert"
import { Send, ArrowUpRight, ArrowDownLeft, User, CreditCard } from "lucide-react"

export default function SendMoneyPage() {
  const [isElderMode, setIsElderMode] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState("en")
  const [showVoiceModal, setShowVoiceModal] = useState(false)
  const [formData, setFormData] = useState({
    recipientName: "",
    transferMethod: "",
    upiId: "",
    accountNumber: "",
    ifscCode: "",
    amount: "",
    note: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const getFraudAlertType = (): "large-amount" | "flagged-recipient" | null => {
    const amount = Number.parseFloat(formData.amount)
    const flaggedAccounts = ["fraud@example.com", "scammer123@upi", "1234567890123456"]

    if (amount > 50000) return "large-amount"
    if (flaggedAccounts.includes(formData.upiId) || flaggedAccounts.includes(formData.accountNumber)) {
      return "flagged-recipient"
    }
    return null
  }

  const handleSendMoney = () => {
    if (!formData.recipientName || !formData.amount || (!formData.upiId && !formData.accountNumber)) {
      alert("Please fill in all required fields")
      return
    }
    setShowVoiceModal(true)
  }

  const handleConfirmTransaction = () => {
    setShowVoiceModal(false)
    alert("Transaction completed successfully!")

    // Reset form
    setFormData({
      recipientName: "",
      transferMethod: "",
      upiId: "",
      accountNumber: "",
      ifscCode: "",
      amount: "",
      note: "",
    })
  }

  const recentTransactions = [
    { name: "John Doe", amount: "₹2,500", type: "sent", time: "2 hours ago" },
    { name: "Sarah Wilson", amount: "₹1,200", type: "received", time: "1 day ago" },
    { name: "Mike Johnson", amount: "₹5,000", type: "sent", time: "2 days ago" },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-gradient-to-br from-background to-muted/20 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="bg-primary/10 p-4 rounded-full">
                <Send className={`text-primary ${isElderMode ? "h-16 w-16" : "h-12 w-12"}`} />
              </div>
            </div>
            <h1 className={`font-bold text-foreground mb-4 ${isElderMode ? "text-5xl" : "text-3xl md:text-4xl"}`}>
              Send Money
            </h1>
            <p className={`text-muted-foreground max-w-2xl mx-auto ${isElderMode ? "text-xl" : "text-lg"}`}>
              Transfer money securely with voice confirmation and fraud protection
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Send Money Form */}
            <div className="lg:col-span-2">
              <Card className="border-border shadow-lg bg-card/50 backdrop-blur">
                <CardHeader className={isElderMode ? "p-8" : ""}>
                  <CardTitle className={`flex items-center gap-3 ${isElderMode ? "text-2xl" : "text-xl"}`}>
                    <Send className={`text-primary ${isElderMode ? "h-8 w-8" : "h-6 w-6"}`} />
                    Transfer Details
                  </CardTitle>
                </CardHeader>
                <CardContent className={isElderMode ? "p-8 pt-0" : ""}>
                  <div className="space-y-6">
                    {/* Fraud Alert */}
                    <FraudAlert type={getFraudAlertType()} isElderMode={isElderMode} />

                    {/* Recipient Information */}
                    <div className="space-y-4">
                      <h3 className={`font-semibold text-foreground ${isElderMode ? "text-xl" : "text-lg"}`}>
                        Recipient Information
                      </h3>

                      <div className="space-y-2">
                        <Label htmlFor="recipientName" className={isElderMode ? "text-lg" : ""}>
                          Recipient Name *
                        </Label>
                        <Input
                          id="recipientName"
                          value={formData.recipientName}
                          onChange={(e) => handleInputChange("recipientName", e.target.value)}
                          placeholder="Enter recipient's full name"
                          className={isElderMode ? "h-14 text-lg" : ""}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="transferMethod" className={isElderMode ? "text-lg" : ""}>
                          Transfer Method *
                        </Label>
                        <Select
                          value={formData.transferMethod}
                          onValueChange={(value) => handleInputChange("transferMethod", value)}
                        >
                          <SelectTrigger className={isElderMode ? "h-14 text-lg" : ""}>
                            <SelectValue placeholder="Choose transfer method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="upi" className={isElderMode ? "text-lg py-3" : ""}>
                              UPI ID
                            </SelectItem>
                            <SelectItem value="account" className={isElderMode ? "text-lg py-3" : ""}>
                              Bank Account
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {formData.transferMethod === "upi" && (
                        <div className="space-y-2">
                          <Label htmlFor="upiId" className={isElderMode ? "text-lg" : ""}>
                            UPI ID *
                          </Label>
                          <Input
                            id="upiId"
                            value={formData.upiId}
                            onChange={(e) => handleInputChange("upiId", e.target.value)}
                            placeholder="example@upi"
                            className={isElderMode ? "h-14 text-lg" : ""}
                          />
                        </div>
                      )}

                      {formData.transferMethod === "account" && (
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="accountNumber" className={isElderMode ? "text-lg" : ""}>
                              Account Number *
                            </Label>
                            <Input
                              id="accountNumber"
                              value={formData.accountNumber}
                              onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                              placeholder="Enter account number"
                              className={isElderMode ? "h-14 text-lg" : ""}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="ifscCode" className={isElderMode ? "text-lg" : ""}>
                              IFSC Code *
                            </Label>
                            <Input
                              id="ifscCode"
                              value={formData.ifscCode}
                              onChange={(e) => handleInputChange("ifscCode", e.target.value.toUpperCase())}
                              placeholder="IFSC Code"
                              className={isElderMode ? "h-14 text-lg" : ""}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Amount and Note */}
                    <div className="space-y-4">
                      <h3 className={`font-semibold text-foreground ${isElderMode ? "text-xl" : "text-lg"}`}>
                        Transfer Amount
                      </h3>

                      <div className="space-y-2">
                        <Label htmlFor="amount" className={isElderMode ? "text-lg" : ""}>
                          Amount (₹) *
                        </Label>
                        <Input
                          id="amount"
                          type="number"
                          value={formData.amount}
                          onChange={(e) => handleInputChange("amount", e.target.value)}
                          placeholder="0.00"
                          className={`${isElderMode ? "h-14 text-lg" : ""} text-2xl font-bold text-center`}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="note" className={isElderMode ? "text-lg" : ""}>
                          Note (Optional)
                        </Label>
                        <Input
                          id="note"
                          value={formData.note}
                          onChange={(e) => handleInputChange("note", e.target.value)}
                          placeholder="Add a note for this transaction"
                          className={isElderMode ? "h-14 text-lg" : ""}
                        />
                      </div>
                    </div>

                    {/* Send Button */}
                    <Button
                      onClick={handleSendMoney}
                      className={`w-full bg-destructive hover:bg-destructive/90 ${isElderMode ? "h-16 text-xl" : "h-12"}`}
                      size={isElderMode ? "lg" : "default"}
                    >
                      <ArrowUpRight className="mr-2 h-5 w-5" />
                      Send ₹{formData.amount || "0"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Transactions Sidebar */}
            <div className="space-y-6">
              <Card className="border-border bg-card/50 backdrop-blur">
                <CardHeader className={isElderMode ? "p-6" : ""}>
                  <CardTitle className={`flex items-center gap-2 ${isElderMode ? "text-xl" : "text-lg"}`}>
                    <CreditCard className={`text-primary ${isElderMode ? "h-6 w-6" : "h-5 w-5"}`} />
                    Recent Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent className={isElderMode ? "p-6 pt-0" : ""}>
                  <div className="space-y-4">
                    {recentTransactions.map((transaction, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-card">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`p-2 rounded-full ${
                              transaction.type === "sent"
                                ? "bg-destructive/10 text-destructive"
                                : "bg-green-100 text-green-600"
                            }`}
                          >
                            {transaction.type === "sent" ? (
                              <ArrowUpRight className="h-4 w-4" />
                            ) : (
                              <ArrowDownLeft className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <div className={`font-medium text-foreground ${isElderMode ? "text-lg" : "text-sm"}`}>
                              {transaction.name}
                            </div>
                            <div className={`text-muted-foreground ${isElderMode ? "text-base" : "text-xs"}`}>
                              {transaction.time}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`font-semibold ${
                            transaction.type === "sent" ? "text-destructive" : "text-green-600"
                          } ${isElderMode ? "text-lg" : ""}`}
                        >
                          {transaction.type === "sent" ? "-" : "+"}
                          {transaction.amount}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-border bg-card/50 backdrop-blur">
                <CardHeader className={isElderMode ? "p-6" : ""}>
                  <CardTitle className={isElderMode ? "text-xl" : "text-lg"}>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className={isElderMode ? "p-6 pt-0" : ""}>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                      size={isElderMode ? "lg" : "default"}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Add New Beneficiary
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                      size={isElderMode ? "lg" : "default"}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      View All Transactions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Voice Confirmation Modal */}
      <VoiceConfirmationModal
        isOpen={showVoiceModal}
        onClose={() => setShowVoiceModal(false)}
        onConfirm={handleConfirmTransaction}
        amount={formData.amount}
        recipientName={formData.recipientName}
        isElderMode={isElderMode}
        currentLanguage={currentLanguage}
      />
    </div>
  )
}
