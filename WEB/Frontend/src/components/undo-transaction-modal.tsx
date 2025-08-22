"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { RotateCcw, Clock } from "lucide-react"

interface UndoTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  onUndo: () => void
  transaction: {
    id: string
    amount: string
    recipientName: string
  }
  isElderMode: boolean
}

export function UndoTransactionModal({ isOpen, onClose, onUndo, transaction, isElderMode }: UndoTransactionModalProps) {
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    if (isOpen) {
      setCountdown(5)
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            onClose()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [isOpen, onClose])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-md ${isElderMode ? "max-w-lg" : ""}`}>
        <DialogHeader>
          <DialogTitle className={`text-center ${isElderMode ? "text-2xl" : "text-xl"}`}>Undo Transaction</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Undo Icon */}
          <div className="flex justify-center">
            <div className="bg-yellow-100 p-6 rounded-full">
              <RotateCcw className={`text-yellow-600 ${isElderMode ? "h-16 w-16" : "h-12 w-12"}`} />
            </div>
          </div>

          {/* Transaction Details */}
          <div className="text-center space-y-4">
            <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
              <p className={`text-foreground font-medium ${isElderMode ? "text-xl" : "text-lg"}`}>
                Undo payment of ₹{transaction.amount}
              </p>
              <p className={`text-primary font-bold ${isElderMode ? "text-2xl" : "text-xl"}`}>
                to {transaction.recipientName}
              </p>
            </div>

            <p className={`text-muted-foreground ${isElderMode ? "text-lg" : ""}`}>
              This will reverse the transaction and refund the amount to your account
            </p>
          </div>

          {/* Countdown */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 text-yellow-600">
              <Clock className="h-4 w-4" />
              <span className={`font-bold ${isElderMode ? "text-xl" : "text-lg"}`}>{countdown}</span>
            </div>
            <p className={`text-muted-foreground ${isElderMode ? "text-lg" : "text-sm"}`}>seconds remaining to undo</p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent"
              size={isElderMode ? "lg" : "default"}
            >
              Keep Transaction
            </Button>
            <Button onClick={onUndo} variant="destructive" className="flex-1" size={isElderMode ? "lg" : "default"}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Undo Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
