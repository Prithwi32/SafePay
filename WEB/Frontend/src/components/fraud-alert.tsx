import { AlertTriangle, Shield } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface FraudAlertProps {
  type: "large-amount" | "flagged-recipient" | null
  isElderMode: boolean
}

export function FraudAlert({ type, isElderMode }: FraudAlertProps) {
  if (!type) return null

  const alerts = {
    "large-amount": {
      icon: AlertTriangle,
      title: "Large Transfer Detected",
      message: "You are sending more than ₹50,000. Please review carefully before proceeding.",
      className: "border-yellow-500/50 bg-yellow-50 text-yellow-800",
    },
    "flagged-recipient": {
      icon: Shield,
      title: "Security Alert",
      message: "This account has been reported in fraud cases. Please verify the recipient before proceeding.",
      className: "border-red-500/50 bg-red-50 text-red-800",
    },
  }

  const alert = alerts[type]
  const Icon = alert.icon

  return (
    <Alert className={`${alert.className} ${isElderMode ? "p-6" : ""}`}>
      <Icon className={`${isElderMode ? "h-6 w-6" : "h-4 w-4"}`} />
      <AlertDescription className={isElderMode ? "text-lg" : ""}>
        <div className={`font-semibold mb-1 ${isElderMode ? "text-xl" : ""}`}>{alert.title}</div>
        {alert.message}
      </AlertDescription>
    </Alert>
  )
}
