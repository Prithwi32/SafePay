import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Mic, MicOff, Volume2, Play } from "lucide-react"

interface VoiceConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  amount: string
  recipientName: string
  isElderMode: boolean
  currentLanguage?: string
}

export function VoiceConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  amount,
  recipientName,
  isElderMode,
  currentLanguage = "en",
}: VoiceConfirmationModalProps) {
  const [isListening, setIsListening] = useState(false)
  const [countdown, setCountdown] = useState(10)
  const [isPlaying, setIsPlaying] = useState(false)

  const speakConfirmation = async () => {
    setIsPlaying(true)

    // Create confirmation message based on language
    const messages = {
      en: `${amount} rupees will be sent to ${recipientName}. Please confirm.`,
      hi: `${amount} रुपये ${recipientName} को भेजे जाएंगे। कृपया पुष्टि करें।`,
      kn: `${amount} ರೂಪಾಯಿಗಳು ${recipientName} ಗೆ ಕಳುಹಿಸಲಾಗುವುದು. ದಯವಿಟ್ಟು ದೃಢೀಕರಿಸಿ.`,
      bn: `${amount} টাকা ${recipientName} কে পাঠানো হবে। অনুগ্রহ করে নিশ্চিত করুন।`,
      ta: `${amount} ரூபாய் ${recipientName} க்கு அனுப்பப்படும். தயவுசெய்து உறுதிப்படுத்தவும்.`,
      te: `${amount} రూపాయలు ${recipientName} కు పంపబడతాయి. దయచేసి నిర్ధారించండి.`,
    }

    const message = messages[currentLanguage as keyof typeof messages] || messages.en

    // Call Python TTS script
    try {
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: message,
          language: currentLanguage,
        }),
      })

      if (response.ok) {
        const audioBlob = await response.blob()
        const audioUrl = URL.createObjectURL(audioBlob)
        const audio = new Audio(audioUrl)

        audio.onended = () => {
          setIsPlaying(false)
          URL.revokeObjectURL(audioUrl)
        }

        await audio.play()
      }
    } catch (error) {
      console.error("TTS Error:", error)
      setIsPlaying(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      setCountdown(10)
      speakConfirmation()

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

  const handleVoiceToggle = () => {
    setIsListening(!isListening)
    // Simulate voice recognition
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false)
      }, 3000)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-md ${isElderMode ? "max-w-lg" : ""}`}>
        <DialogHeader>
          <DialogTitle className={`text-center ${isElderMode ? "text-2xl" : "text-xl"}`}>
            Voice Confirmation Required
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Voice Animation */}
          <div className="flex justify-center">
            <div className={`bg-primary/10 p-6 rounded-full ${isListening || isPlaying ? "animate-pulse" : ""}`}>
              {isPlaying ? (
                <Volume2 className={`text-primary ${isElderMode ? "h-16 w-16" : "h-12 w-12"}`} />
              ) : isListening ? (
                <Mic className={`text-primary ${isElderMode ? "h-16 w-16" : "h-12 w-12"}`} />
              ) : (
                <MicOff className={`text-muted-foreground ${isElderMode ? "h-16 w-16" : "h-12 w-12"}`} />
              )}
            </div>
          </div>

          {/* Confirmation Text */}
          <div className="text-center space-y-4">
            <div className={`bg-destructive/10 p-4 rounded-lg border border-destructive/20`}>
              <p className={`text-foreground font-medium ${isElderMode ? "text-xl" : "text-lg"}`}>
                ₹{amount} will be sent to
              </p>
              <p className={`text-primary font-bold ${isElderMode ? "text-2xl" : "text-xl"}`}>{recipientName}</p>
            </div>

            <p className={`text-muted-foreground ${isElderMode ? "text-lg" : ""}`}>
              {isPlaying ? "Playing confirmation message..." : 'Please say "CONFIRM" to proceed with this transaction'}
            </p>

            {isListening && (
              <div className="flex items-center justify-center space-x-2 text-primary">
                <Volume2 className="h-4 w-4 animate-pulse" />
                <span className={isElderMode ? "text-lg" : ""}>Listening...</span>
              </div>
            )}
          </div>

          {/* Countdown */}
          <div className="text-center">
            <p className={`text-muted-foreground ${isElderMode ? "text-lg" : "text-sm"}`}>
              Auto-cancel in {countdown} seconds
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent"
              size={isElderMode ? "lg" : "default"}
            >
              Cancel
            </Button>
            <Button
              onClick={speakConfirmation}
              variant="secondary"
              className="flex-1"
              size={isElderMode ? "lg" : "default"}
              disabled={isPlaying}
            >
              <Play className="mr-2 h-4 w-4" />
              {isPlaying ? "Playing..." : "Replay"}
            </Button>
            <Button onClick={onConfirm} className="flex-1" size={isElderMode ? "lg" : "default"}>
              Confirm
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
