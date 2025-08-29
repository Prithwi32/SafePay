import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FraudAlert } from "@/components/fraud-alert";
import { Volume2 } from "lucide-react";
import { UndoTransactionModal } from "@/components/undo-transaction-modal";
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
} from "lucide-react";

interface Transaction {
  id: string;
  type: "sent" | "received";
  amount: string;
  recipientName: string;
  senderName?: string;
  date: string;
  time: string;
  status: "completed" | "pending" | "failed";
  isFraudulent?: boolean;
  isRecent?: boolean;
  note?: string;
  method: "UPI" | "Bank Transfer" | "Card";
}

const translations: Record<string, any> = {
  en: {
    pageTitle: "Review Money",
    pageDescription:
      "Monitor your transactions and detect suspicious activities",
    totalSent: "Total Sent",
    totalReceived: "Total Received",
    fraudAlerts: "Fraud Alerts",
    searchPlaceholder: "Search transactions...",
    allTransactions: "All Transactions",
    sentOnly: "Sent Only",
    receivedOnly: "Received Only",
    fraudOnly: "Fraud Alerts",
    transactionHistory: "Transaction History",
    to: "To",
    from: "From",
    note: "Note",
    suspiciousActivity: "Suspicious Activity Detected",
    suspiciousMessage:
      "This transaction has been flagged for unusual patterns. Please verify if this was authorized.",
    undo: "Undo",
    transactionReversed: "Transaction has been reversed successfully!",
    undoTransactionTitle: "Undo Transaction",
    undoPaymentText: "Undo payment of",
    toText: "to",
    undoDescription:
      "This will reverse the transaction and refund the amount to your account",
    secondsRemaining: "seconds remaining to undo",
    keepTransaction: "Keep Transaction",
    undoNow: "Undo Now",
  },
  hi: {
    pageTitle: "पैसे की समीक्षा",
    pageDescription:
      "अपने लेन-देन की निगरानी करें और संदिग्ध गतिविधियों का पता लगाएँ",
    totalSent: "कुल भेजी गई राशि",
    totalReceived: "कुल प्राप्त राशि",
    fraudAlerts: "धोखाधड़ी अलर्ट",
    searchPlaceholder: "लेन-देन खोजें...",
    allTransactions: "सभी लेन-देन",
    sentOnly: "केवल भेजी गई",
    receivedOnly: "केवल प्राप्त",
    fraudOnly: "धोखाधड़ी अलर्ट",
    transactionHistory: "लेन-देन इतिहास",
    to: "को",
    from: "से",
    note: "नोट",
    suspiciousActivity: "संदेहास्पद गतिविधि",
    suspiciousMessage:
      "इस लेन-देन को असामान्य पैटर्न के लिए चिह्नित किया गया है। कृपया जांचें कि यह अधिकृत था।",
    undo: "पूर्ववत करें",
    transactionReversed: "लेन-देन सफलतापूर्वक पूर्ववत कर दिया गया!",
    undoTransactionTitle: "लेन-देन पूर्ववत करें",
    undoPaymentText: "भुगतान पूर्ववत करें",
    toText: "को",
    undoDescription: "यह लेन-देन को उलट देगा और राशि आपके खाते में लौटाई जाएगी",
    secondsRemaining: "पूर्ववत करने के लिए शेष सेकंड",
    keepTransaction: "लेन-देन बनाए रखें",
    undoNow: "अब पूर्ववत करें",
  },
  ta: {
    pageTitle: "பணம் பரிசீலனை",
    pageDescription:
      "உங்கள் பரிவர்த்தனைகளை கண்காணிக்கவும் சந்தேகமான செயல்பாடுகளை கண்டறியவும்",
    totalSent: "மொத்த அனுப்பிய தொகை",
    totalReceived: "மொத்த பெறிய தொகை",
    fraudAlerts: "மோசடி எச்சரிக்கை",
    searchPlaceholder: "பரிவர்த்தனைகளைத் தேடு...",
    allTransactions: "அனைத்து பரிவர்த்தனைகள்",
    sentOnly: "அனுப்பியவை மட்டும்",
    receivedOnly: "பெற்றவை மட்டும்",
    fraudOnly: "மோசடி எச்சரிக்கை",
    transactionHistory: "பரிவர்த்தனை வரலாறு",
    to: "க்கு",
    from: "இருந்து",
    note: "குறிப்பு",
    suspiciousActivity: "சந்தேகமான செயல்பாடு கண்டறியப்பட்டது",
    suspiciousMessage:
      "இந்த பரிவர்த்தனை விதிவிலக்கான மாதிரிகளுக்கு குறியிடப்பட்டுள்ளது. இது அனுமதிக்கப்பட்டதா என்பதைச் சரிபார்க்கவும்.",
    undo: "மீட்டமை",
    transactionReversed: "பரிவர்த்தனை வெற்றிகரமாக மீட்டமைக்கப்பட்டது!",
    undoTransactionTitle: "பரிவர்த்தனை மீட்டமை",
    undoPaymentText: "பணம் மீட்டமை",
    toText: "க்கு",
    undoDescription:
      "இது பரிவர்த்தனையை மாற்றிவிட்டு தொகையை உங்கள் கணக்கிற்கு திருப்பிவிடும்",
    secondsRemaining: "மீட்டமைக்க மீதமுள்ள விநாடிகள்",
    keepTransaction: "பரிவர்த்தனையை வைத்திருங்கள்",
    undoNow: "இப்போது மீட்டமை",
  },
  kn: {
    pageTitle: "ಹಣ ಪರಿಶೀಲನೆ",
    pageDescription:
      "ನಿಮ್ಮ ವಹಿವಾಟುಗಳನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡಿ ಮತ್ತು ಸಂಶಯಾಸ್ಪದ ಚಟುವಟಿಕೆಗಳನ್ನು ಕಂಡುಹಿಡಿಯಿರಿ",
    totalSent: "ಒಟ್ಟು ಕಳುಹಿಸಲಾಗಿದೆ",
    totalReceived: "ಒಟ್ಟು ಸ್ವೀಕರಿಸಲಾಗಿದೆ",
    fraudAlerts: "ತಪ್ಪು ಎಚ್ಚರಿಕೆಗಳು",
    searchPlaceholder: "ವಹಿವಾಟುಗಳನ್ನು ಹುಡುಕಿ...",
    allTransactions: "ಎಲ್ಲಾ ವಹಿವಾಟುಗಳು",
    sentOnly: "ಕೇವಲ ಕಳುಹಿಸಿದವು",
    receivedOnly: "ಕೇವಲ ಸ್ವೀಕರಿಸಿದವು",
    fraudOnly: "ತಪ್ಪು ಎಚ್ಚರಿಕೆಗಳು",
    transactionHistory: "ವಹಿವಾಟು ಇತಿಹಾಸ",
    to: "ಗೆ",
    from: "ಇಂದ",
    note: "ಸೂಚನೆ",
    suspiciousActivity: "ಸಂಶಯಾಸ್ಪದ ಚಟುವಟಿಕೆ ಪತ್ತೆಹಚ್ಚಲಾಗಿದೆ",
    suspiciousMessage:
      "ಈ ವಹಿವಾಟು ಅಸಾಮಾನ್ಯ ಮಾದರಿಗಳಿಗೆ ಫ್ಲ್ಯಾಗ್ ಮಾಡಲಾಗಿದೆ. ಇದು ಅನುಮತಿಸಲ್ಪಟ್ಟದ್ದೇ ಎಂದು ದಯವಿಟ್ಟು ಪರಿಶೀಲಿಸಿ.",
    undo: "ಹಿಂತಿರುಗಿಸಿ",
    transactionReversed: "ವಹಿವಾಟು ಯಶಸ್ವಿಯಾಗಿ ಹಿಂತಿರುಗಿಸಲಾಗಿದೆ!",
    undoTransactionTitle: "ವಹಿವಾಟು ಹಿಂತಿರುಗಿಸಿ",
    undoPaymentText: "ಪಾವತಿ ಹಿಂತಿರುಗಿಸಿ",
    toText: "ಗೆ",
    undoDescription:
      "ಈ ವಹಿವಾಟು ಹಿಂತಿರುಗಿಸಲಾಗುವುದು ಮತ್ತು ಮೊತ್ತ ನಿಮ್ಮ ಖಾತೆಗೆ ಹಿಂತಿರುಗಿಸಲಾಗುವುದು",
    secondsRemaining: "ಹಿಂತಿರುಗಿಸಲು ಬಾಕಿ ಸೆಕೆಂಡುಗಳು",
    keepTransaction: "ವಹಿವಾಟೆ ಇಟ್ಟುಕೊಳ್ಳಿ",
    undoNow: "ಈಗ ಹಿಂತಿರುಗಿಸಿ",
  },
};

export default function ReviewMoneyPage() {
  const [isElderMode, setIsElderMode] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showUndoModal, setShowUndoModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const t = translations[currentLanguage];

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
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTransactions((prev) => prev.map((t) => ({ ...t, isRecent: false })));
    }, 30_000);
    return () => clearTimeout(timer);
  }, []);

  const handleUndoTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowUndoModal(true);
  };

  const confirmUndo = () => {
    if (selectedTransaction) {
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === selectedTransaction.id
            ? { ...t, status: "failed" as const }
            : t
        )
      );
      setShowUndoModal(false);
      setSelectedTransaction(null);
      alert("Transaction has been reversed successfully!");
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.recipientName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (transaction.senderName &&
        transaction.senderName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()));

    const matchesFilter =
      filterType === "all" ||
      (filterType === "sent" && transaction.type === "sent") ||
      (filterType === "received" && transaction.type === "received") ||
      (filterType === "fraudulent" && transaction.isFraudulent);

    return matchesSearch && matchesFilter;
  });

  const totalSent = transactions
    .filter((t) => t.type === "sent" && t.status === "completed")
    .reduce((sum, t) => sum + Number.parseFloat(t.amount), 0);

  const totalReceived = transactions
    .filter((t) => t.type === "received" && t.status === "completed")
    .reduce((sum, t) => sum + Number.parseFloat(t.amount), 0);

  const fraudulentCount = transactions.filter((t) => t.isFraudulent).length;

  const handleReadTransaction = async (transaction: Transaction) => {
    const summary =
      transaction.type === "sent"
        ? `${t.to} ${transaction.recipientName} payment of ₹${transaction.amount} was done on ${transaction.date} at ${transaction.time}.`
        : `${t.from} ${transaction.senderName} payment of ₹${transaction.amount} was received on ${transaction.date} at ${transaction.time}.`;

    const fullText = transaction.isFraudulent
      ? summary + " This transaction is flagged as suspicious by our system."
      : summary;

    try {
      const res = await fetch("http://localhost:8000/api/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: fullText, language: currentLanguage }),
      });

      if (!res.ok) throw new Error("TTS failed");

      const audioBlob = await res.blob();
      const url = URL.createObjectURL(audioBlob);
      const audio = new Audio(url);
      audio.play();
    } catch (err) {
      console.error(err);
      alert("Unable to read transaction.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-4 flex justify-end gap-2">
        <select
          value={currentLanguage}
          onChange={(e) => setCurrentLanguage(e.target.value)}
        >
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
          <option value="ta">தமிழ்</option>
          <option value="kn">ಕನ್ನಡ</option>
        </select>
      </div>

      <main className="flex-1 bg-gradient-to-br from-background to-card py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="bg-primary/10 p-4 rounded-full">
                <History
                  className={`text-primary ${
                    isElderMode ? "h-16 w-16" : "h-12 w-12"
                  }`}
                />
              </div>
            </div>
            <h1
              className={`font-bold text-foreground mb-4 ${
                isElderMode ? "text-5xl" : "text-3xl md:text-4xl"
              }`}
            >
              {t.pageTitle}
            </h1>
            <p
              className={`text-muted-foreground max-w-2xl mx-auto ${
                isElderMode ? "text-xl" : "text-lg"
              }`}
            >
              {t.pageDescription}
            </p>
          </div>

          {fraudulentCount > 0 && (
            <div className="mb-8">
              <FraudAlert type="flagged-recipient" isElderMode={isElderMode} />
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="border-border">
              <CardContent className={`p-6 ${isElderMode ? "p-8" : ""}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className={`text-muted-foreground ${
                        isElderMode ? "text-lg" : "text-sm"
                      }`}
                    >
                      {t.totalSent}
                    </p>
                    <p
                      className={`font-bold text-destructive ${
                        isElderMode ? "text-3xl" : "text-2xl"
                      }`}
                    >
                      ₹{totalSent.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-destructive/10 p-3 rounded-full">
                    <TrendingDown
                      className={`text-destructive ${
                        isElderMode ? "h-8 w-8" : "h-6 w-6"
                      }`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className={`p-6 ${isElderMode ? "p-8" : ""}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className={`text-muted-foreground ${
                        isElderMode ? "text-lg" : "text-sm"
                      }`}
                    >
                      {t.totalReceived}
                    </p>
                    <p
                      className={`font-bold text-green-600 ${
                        isElderMode ? "text-3xl" : "text-2xl"
                      }`}
                    >
                      ₹{totalReceived.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <TrendingUp
                      className={`text-green-600 ${
                        isElderMode ? "h-8 w-8" : "h-6 w-6"
                      }`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className={`p-6 ${isElderMode ? "p-8" : ""}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className={`text-muted-foreground ${
                        isElderMode ? "text-lg" : "text-sm"
                      }`}
                    >
                      {t.fraudAlerts}
                    </p>
                    <p
                      className={`font-bold text-yellow-600 ${
                        isElderMode ? "text-3xl" : "text-2xl"
                      }`}
                    >
                      {fraudulentCount}
                    </p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <AlertTriangle
                      className={`text-yellow-600 ${
                        isElderMode ? "h-8 w-8" : "h-6 w-6"
                      }`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border mb-8">
            <CardContent className={`p-6 ${isElderMode ? "p-8" : ""}`}>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground ${
                      isElderMode ? "h-6 w-6" : "h-4 w-4"
                    }`}
                  />
                  <Input
                    placeholder={t.searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`pl-10 ${
                      isElderMode ? "h-14 text-lg pl-12" : ""
                    }`}
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger
                    className={`w-full md:w-48 ${
                      isElderMode ? "h-14 text-lg" : ""
                    }`}
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value="all"
                      className={isElderMode ? "text-lg py-3" : ""}
                    >
                      {t.allTransactions}
                    </SelectItem>
                    <SelectItem
                      value="sent"
                      className={isElderMode ? "text-lg py-3" : ""}
                    >
                      {t.sentOnly}
                    </SelectItem>
                    <SelectItem
                      value="received"
                      className={isElderMode ? "text-lg py-3" : ""}
                    >
                      {t.receivedOnly}
                    </SelectItem>
                    <SelectItem
                      value="fraudulent"
                      className={isElderMode ? "text-lg py-3" : ""}
                    >
                      {t.fraudOnly}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className={isElderMode ? "p-8" : ""}>
              <CardTitle
                className={`flex items-center gap-3 ${
                  isElderMode ? "text-2xl" : "text-xl"
                }`}
              >
                <History
                  className={`text-primary ${
                    isElderMode ? "h-8 w-8" : "h-6 w-6"
                  }`}
                />
                {t.transactionHistory}
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
                        <div
                          className={`p-3 rounded-full ${
                            transaction.type === "sent"
                              ? "bg-destructive/10 text-destructive"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          {transaction.type === "sent" ? (
                            <ArrowUpRight
                              className={isElderMode ? "h-6 w-6" : "h-5 w-5"}
                            />
                          ) : (
                            <ArrowDownLeft
                              className={isElderMode ? "h-6 w-6" : "h-5 w-5"}
                            />
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span
                              className={`font-semibold text-foreground ${
                                isElderMode ? "text-xl" : "text-lg"
                              }`}
                            >
                              {transaction.type === "sent"
                                ? `${t.to} ${transaction.recipientName}`
                                : `${t.from} ${transaction.senderName}`}
                            </span>
                            {transaction.isFraudulent && (
                              <Badge
                                variant="destructive"
                                className={isElderMode ? "text-sm" : "text-xs"}
                              >
                                {t.suspiciousActivity}
                              </Badge>
                            )}
                            {transaction.isRecent && (
                              <Badge
                                variant="secondary"
                                className={isElderMode ? "text-sm" : "text-xs"}
                              >
                                {transaction.note === "Large transfer"
                                  ? "Large Transfer"
                                  : "Recent"}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-muted-foreground">
                            <span
                              className={isElderMode ? "text-base" : "text-sm"}
                            >
                              {transaction.date} at {transaction.time}
                            </span>
                            <span
                              className={isElderMode ? "text-base" : "text-sm"}
                            >
                              {transaction.method}
                            </span>
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
                            <p
                              className={`text-muted-foreground mt-1 ${
                                isElderMode ? "text-base" : "text-sm"
                              }`}
                            >
                              {t.note}: {transaction.note}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="text-right flex flex-col items-end space-y-1">
                        <div
                          className={`font-bold ${
                            transaction.type === "sent"
                              ? "text-destructive"
                              : "text-green-600"
                          } ${isElderMode ? "text-2xl" : "text-xl"}`}
                        >
                          {transaction.type === "sent" ? "-" : "+"}₹
                          {Number.parseFloat(
                            transaction.amount
                          ).toLocaleString()}
                        </div>

                        <button
                          onClick={() => handleReadTransaction(transaction)}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <Volume2 className="h-5 w-5 text-primary" />
                        </button>

                        {transaction.isRecent &&
                          transaction.type === "sent" &&
                          transaction.status === "completed" && (
                            <Button
                              variant="outline"
                              size={isElderMode ? "default" : "sm"}
                              onClick={() => handleUndoTransaction(transaction)}
                              className="bg-transparent"
                            >
                              <RotateCcw className="mr-1 h-3 w-3" />
                              {t.undo}
                            </Button>
                          )}
                      </div>
                    </div>

                    {transaction.isFraudulent && (
                      <div className="mt-4 p-3 bg-red-100 border border-red-200 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p
                              className={`font-medium text-red-800 ${
                                isElderMode ? "text-lg" : "text-sm"
                              }`}
                            >
                              {t.suspiciousActivity}
                            </p>
                            <p
                              className={`text-red-700 ${
                                isElderMode ? "text-base" : "text-xs"
                              }`}
                            >
                              {t.suspiciousMessage}
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
                      className={`mx-auto text-muted-foreground mb-4 ${
                        isElderMode ? "h-16 w-16" : "h-12 w-12"
                      }`}
                    />
                    <p
                      className={`text-muted-foreground ${
                        isElderMode ? "text-xl" : "text-lg"
                      }`}
                    >
                      {t.noTransactionsFound || "No transactions found."}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {selectedTransaction && (
        <UndoTransactionModal
          isOpen={showUndoModal}
          onClose={() => setShowUndoModal(false)}
          onUndo={confirmUndo}
          transaction={selectedTransaction}
          isElderMode={isElderMode}
          t={t}
        />
      )}
    </div>
  );
}
