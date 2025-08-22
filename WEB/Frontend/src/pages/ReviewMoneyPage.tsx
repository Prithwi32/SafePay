import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { FraudAlert } from "@/components/fraud-alert"
import { UndoTransactionModal } from "@/components/undo-transaction-modal"
import {
  History,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Filter,
  AlertTriangle,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  DollarSign,
} from "lucide-react"

interface Transaction {
  id: string
  type: "sent" | "received"
  amount: string
  recipientName: string
  senderName?: string
  date: string
  time: string
  status: "completed" | "pending" | "failed"
  isFraudulent?: boolean
  isRecent?: boolean
  note?: string
  method: "UPI" | "Bank Transfer" | "Card"
}

export default function ReviewMoneyPage() {
  const [isElderMode, setIsElderMode] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState("en")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [showUndoModal, setShowUndoModal] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "sent",
      amount: "75000",
      recipientName: "Unknown Account",
      date: "2024-01-15",
      time: "14:30",
      status: "completed",
      isFraudulent: true,
      isRecent: true,
      note: "Large transfer",
      method: "UPI",
    },
    {
      id: "2",
      type: "received",
      amount: "2500",
      senderName: "John Doe",
      recipientName: "You",
      date: "2024-01-15",
      time: "12:15",
      status: "completed",
      method: "UPI",
    },
    {
      id: "3",
      type: "sent",
      amount: "1200",
      recipientName: "Sarah Wilson",
      date: "2024-01-14",
      time: "18:45",
      status: "completed",
      method: "Bank Transfer",
    },
    {
      id: "4",
      type: "sent",
      amount: "5000",
      recipientName: "Mike Johnson",
      date: "2024-01-14",
      time: "16:20",
      status: "completed",
      method: "UPI",
    },
    {
      id: "5",
      type: "received",
      amount: "3200",
      senderName: "Emma Davis",
      recipientName: "You",
      date: "2024-01-13",
      time: "10:30",
      status: "completed",
      method: "Bank Transfer",
    },
    {
      id: "6",
      type: "sent",
      amount: "800",
      recipientName: "Local Store",
      date: "2024-01-13",
      time: "09:15",
      status: "failed",
      method: "UPI",
    },
    {
      id: "7",
      type: "sent",
      amount: "60000",
      recipientName: "Suspicious Account",
      date: "2024-01-12",
      time: "22:45",
      status: "completed",
      isFraudulent: true,
      method: "Bank Transfer",
    },
  ])

  const handleUndoTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setShowUndoModal(true)
  }

  const confirmUndo = () => {
    if (selectedTransaction) {
      setTransactions((prev) =>
        prev.map((t) => (t.id === selectedTransaction.id ? { ...t, status: "failed" as const } : t)),
      )
      setShowUndoModal(false)
      setSelectedTransaction(null)
      alert("Transaction has been reversed successfully!")
    }
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.senderName && transaction.senderName.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesFilter =
      filterType === "all" ||
      (filterType === "sent" && transaction.type === "sent") ||
      (filterType === "received" && transaction.type === "received") ||
      (filterType === "fraudulent" && transaction.isFraudulent)

    return matchesSearch && matchesFilter
  })

  const totalSent = transactions
    .filter((t) => t.type === "sent" && t.status === "completed")
    .reduce((sum, t) => sum + Number.parseFloat(t.amount), 0)

  const totalReceived = transactions
    .filter((t) => t.type === "received" && t.status === "completed")
    .reduce((sum, t) => sum + Number.parseFloat(t.amount), 0)

  const fraudulentCount = transactions.filter((t) => t.isFraudulent).length

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-gradient-to-br from-background to-card py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="bg-primary/10 p-4 rounded-full">
                <History className={`text-primary ${isElderMode ? "h-16 w-16" : "h-12 w-12"}`} />
              </div>
            </div>
            <h1 className={`font-bold text-foreground mb-4 ${isElderMode ? "text-5xl" : "text-3xl md:text-4xl"}`}>
              Review Money
            </h1>
            <p className={`text-muted-foreground max-w-2xl mx-auto ${isElderMode ? "text-xl" : "text-lg"}`}>
              Monitor your transactions and detect suspicious activities
            </p>
          </div>

          {/* Fraud Alert Banner */}
          {fraudulentCount > 0 && (
            <div className="mb-8">
              <FraudAlert type="flagged-recipient" isElderMode={isElderMode} />
            </div>
          )}

          {/* Summary Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="border-border">
              <CardContent className={`p-6 ${isElderMode ? "p-8" : ""}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-muted-foreground ${isElderMode ? "text-lg" : "text-sm"}`}>Total Sent</p>
                    <p className={`font-bold text-destructive ${isElderMode ? "text-3xl" : "text-2xl"}`}>
                      ₹{totalSent.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-destructive/10 p-3 rounded-full">
                    <TrendingDown className={`text-destructive ${isElderMode ? "h-8 w-8" : "h-6 w-6"}`} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className={`p-6 ${isElderMode ? "p-8" : ""}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-muted-foreground ${isElderMode ? "text-lg" : "text-sm"}`}>Total Received</p>
                    <p className={`font-bold text-green-600 ${isElderMode ? "text-3xl" : "text-2xl"}`}>
                      ₹{totalReceived.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <TrendingUp className={`text-green-600 ${isElderMode ? "h-8 w-8" : "h-6 w-6"}`} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className={`p-6 ${isElderMode ? "p-8" : ""}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-muted-foreground ${isElderMode ? "text-lg" : "text-sm"}`}>Fraud Alerts</p>
                    <p className={`font-bold text-yellow-600 ${isElderMode ? "text-3xl" : "text-2xl"}`}>
                      {fraudulentCount}
                    </p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <AlertTriangle className={`text-yellow-600 ${isElderMode ? "h-8 w-8" : "h-6 w-6"}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="border-border mb-8">
            <CardContent className={`p-6 ${isElderMode ? "p-8" : ""}`}>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground ${
                        isElderMode ? "h-6 w-6" : "h-4 w-4"
                      }`}
                    />
                    <Input
                      placeholder="Search transactions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`pl-10 ${isElderMode ? "h-14 text-lg pl-12" : ""}`}
                    />
                  </div>
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className={`w-full md:w-48 ${isElderMode ? "h-14 text-lg" : ""}`}>
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className={isElderMode ? "text-lg py-3" : ""}>
                      All Transactions
                    </SelectItem>
                    <SelectItem value="sent" className={isElderMode ? "text-lg py-3" : ""}>
                      Sent Only
                    </SelectItem>
                    <SelectItem value="received" className={isElderMode ? "text-lg py-3" : ""}>
                      Received Only
                    </SelectItem>
                    <SelectItem value="fraudulent" className={isElderMode ? "text-lg py-3" : ""}>
                      Fraud Alerts
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Transactions List */}
          <Card className="border-border">
            <CardHeader className={isElderMode ? "p-8" : ""}>
              <CardTitle className={`flex items-center gap-3 ${isElderMode ? "text-2xl" : "text-xl"}`}>
                <History className={`text-primary ${isElderMode ? "h-8 w-8" : "h-6 w-6"}`} />
                Transaction History
              </CardTitle>
            </CardHeader>
            <CardContent className={isElderMode ? "p-8 pt-0" : ""}>
              <div className="space-y-4">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                      transaction.isFraudulent
                        ? "border-red-200 bg-red-50"
                        : transaction.status === "failed"
                          ? "border-gray-200 bg-gray-50"
                          : "border-border bg-card"
                    } ${isElderMode ? "p-6" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {/* Transaction Icon */}
                        <div
                          className={`p-3 rounded-full ${
                            transaction.type === "sent"
                              ? "bg-destructive/10 text-destructive"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          {transaction.type === "sent" ? (
                            <ArrowUpRight className={isElderMode ? "h-6 w-6" : "h-5 w-5"} />
                          ) : (
                            <ArrowDownLeft className={isElderMode ? "h-6 w-6" : "h-5 w-5"} />
                          )}
                        </div>

                        {/* Transaction Details */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className={`font-semibold text-foreground ${isElderMode ? "text-xl" : "text-lg"}`}>
                              {transaction.type === "sent"
                                ? `To ${transaction.recipientName}`
                                : `From ${transaction.senderName}`}
                            </span>
                            {transaction.isFraudulent && (
                              <Badge variant="destructive" className={isElderMode ? "text-sm" : "text-xs"}>
                                Fraud Alert
                              </Badge>
                            )}
                            {transaction.isRecent && (
                              <Badge variant="secondary" className={isElderMode ? "text-sm" : "text-xs"}>
                                Recent
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-muted-foreground">
                            <span className={isElderMode ? "text-base" : "text-sm"}>
                              {transaction.date} at {transaction.time}
                            </span>
                            <span className={isElderMode ? "text-base" : "text-sm"}>{transaction.method}</span>
                            <Badge
                              variant={
                                transaction.status === "completed"
                                  ? "default"
                                  : transaction.status === "pending"
                                    ? "secondary"
                                    : "destructive"
                              }
                              className={isElderMode ? "text-sm" : "text-xs"}
                            >
                              {transaction.status}
                            </Badge>
                          </div>
                          {transaction.note && (
                            <p className={`text-muted-foreground mt-1 ${isElderMode ? "text-base" : "text-sm"}`}>
                              Note: {transaction.note}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Amount and Actions */}
                      <div className="text-right">
                        <div
                          className={`font-bold mb-2 ${
                            transaction.type === "sent" ? "text-destructive" : "text-green-600"
                          } ${isElderMode ? "text-2xl" : "text-xl"}`}
                        >
                          {transaction.type === "sent" ? "-" : "+"}₹
                          {Number.parseFloat(transaction.amount).toLocaleString()}
                        </div>
                        {transaction.isRecent && transaction.type === "sent" && transaction.status === "completed" && (
                          <Button
                            variant="outline"
                            size={isElderMode ? "default" : "sm"}
                            onClick={() => handleUndoTransaction(transaction)}
                            className="bg-transparent"
                          >
                            <RotateCcw className="mr-1 h-3 w-3" />
                            Undo
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Fraud Warning */}
                    {transaction.isFraudulent && (
                      <div className="mt-4 p-3 bg-red-100 border border-red-200 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className={`font-medium text-red-800 ${isElderMode ? "text-lg" : "text-sm"}`}>
                              Suspicious Activity Detected
                            </p>
                            <p className={`text-red-700 ${isElderMode ? "text-base" : "text-xs"}`}>
                              This transaction has been flagged for unusual patterns. Please verify if this was
                              authorized.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {filteredTransactions.length === 0 && (
                  <div className="text-center py-12">
                    <DollarSign
                      className={`mx-auto text-muted-foreground mb-4 ${isElderMode ? "h-16 w-16" : "h-12 w-12"}`}
                    />
                    <p className={`text-muted-foreground ${isElderMode ? "text-xl" : "text-lg"}`}>
                      No transactions found matching your criteria
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Undo Transaction Modal */}
      {selectedTransaction && (
        <UndoTransactionModal
          isOpen={showUndoModal}
          onClose={() => setShowUndoModal(false)}
          onUndo={confirmUndo}
          transaction={selectedTransaction}
          isElderMode={isElderMode}
        />
      )}
    </div>
  )
}
