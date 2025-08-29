import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mic, MicOff, Volume2, Play } from "lucide-react";

interface VoiceConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  amount: string;
  recipientName: string;
  isElderMode: boolean;
  currentLanguage?: string;
}

const translations: Record<string, any> = {
  en: {
    title: "Voice Confirmation Required",
    autoCancel: (s: number) => `Auto-cancel in ${s} seconds`,
    confirmMessage: 'Please say "CONFIRM" to proceed with this transaction',
    playing: "Playing confirmation message...",
    cancel: "Cancel",
    replay: "Replay",
    confirm: "Confirm",
    sending: (amt: string, name: string) => `₹${amt} will be sent to`,
  },
  hi: {
    title: "वॉइस पुष्टि आवश्यक है",
    autoCancel: (s: number) => `${s} सेकंड में स्वतः रद्द हो जाएगा`,
    confirmMessage: "कृपया लेनदेन जारी रखने के लिए 'CONFIRM' कहें",
    playing: "पुष्टि संदेश चल रहा है...",
    cancel: "रद्द करें",
    replay: "पुनः चलाएँ",
    confirm: "पुष्टि करें",
    sending: (amt: string, name: string) => `₹${amt} भेजा जाएगा`,
  },
  ta: {
    title: "குரல் உறுதிப்படுத்தல் தேவை",
    autoCancel: (s: number) => `${s} விநாடிகளில் தானாக ரத்து செய்யப்படும்`,
    confirmMessage: "இந்த பரிவர்த்தனையை தொடர 'CONFIRM' என்று சொல்லவும்",
    playing: "உறுதிப்படுத்தும் செய்தி இயங்குகிறது...",
    cancel: "ரத்து செய்",
    replay: "மீண்டும் இயக்கு",
    confirm: "உறுதிப்படுத்து",
    sending: (amt: string, name: string) => `₹${amt} அனுப்பப்படும்`,
  },
  te: {
    title: "వాయిస్ నిర్ధారణ అవసరం",
    autoCancel: (s: number) => `${s} సెకన్లలో ఆటో-రద్దు అవుతుంది`,
    confirmMessage: "దయచేసి ఈ లావాదేవీ కొనసాగించడానికి 'CONFIRM' అని చెప్పండి",
    playing: "నిర్ధారణ సందేశం ప్లే అవుతోంది...",
    cancel: "రద్దు",
    replay: "మళ్ళీ ప్లే చేయి",
    confirm: "నిర్ధారించు",
    sending: (amt: string, name: string) => `₹${amt} పంపబడుతుంది`,
  },
  kn: {
    title: "ವಾಯ್ಸ್ ದೃಢೀಕರಣ ಅಗತ್ಯವಿದೆ",
    autoCancel: (s: number) => `${s} ಸೆಕೆಂಡುಗಳಲ್ಲಿ ಸ್ವಯಂ-ರದ್ದು ಆಗುತ್ತದೆ`,
    confirmMessage: "ಈ ವಹಿವಾಟನ್ನು ಮುಂದುವರಿಸಲು ದಯವಿಟ್ಟು 'CONFIRM' ಎಂದು ಹೇಳಿ",
    playing: "ದೃಢೀಕರಣ ಸಂದೇಶವನ್ನು ಪ್ಲೇ ಮಾಡಲಾಗುತ್ತಿದೆ...",
    cancel: "ರದ್ದುಮಾಡಿ",
    replay: "ಮರು ಪ್ಲೇ",
    confirm: "ದೃಢೀಕರಿಸಿ",
    sending: (amt: string, name: string) => `₹${amt} ಕಳುಹಿಸಲಾಗುತ್ತದೆ`,
  },
  bn: {
    title: "ভয়েস নিশ্চিতকরণ প্রয়োজন",
    autoCancel: (s: number) => `${s} সেকেন্ডে স্বয়ংক্রিয়ভাবে বাতিল হবে`,
    confirmMessage: "এই লেনদেন চালিয়ে যেতে অনুগ্রহ করে 'CONFIRM' বলুন",
    playing: "নিশ্চিতকরণ বার্তা বাজানো হচ্ছে...",
    cancel: "বাতিল করুন",
    replay: "পুনরায় চালান",
    confirm: "নিশ্চিত করুন",
    sending: (amt: string, name: string) => `₹${amt} পাঠানো হবে`,
  },
};

export function VoiceConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  amount,
  recipientName,
  isElderMode,
  currentLanguage = "en",
}: VoiceConfirmationModalProps) {
  const [isListening, setIsListening] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speakConfirmation = async () => {
    setIsPlaying(true);

    const messages = {
      en: `${amount} rupees will be sent to ${recipientName}. Please confirm.`,
      hi: `${amount} रुपये ${recipientName} को भेजे जाएंगे। कृपया पुष्टि करें।`,
      kn: `${amount} ರೂಪಾಯಿಗಳು ${recipientName} ಗೆ ಕಳುಹಿಸಲಾಗುವುದು. ದಯವಿಟ್ಟು ದೃಢೀಕರಿಸಿ.`,
      bn: `${amount} টাকা ${recipientName} কে পাঠানো হবে। অনুগ্রহ করে নিশ্চিত করুন।`,
      ta: `${amount} ரூபாய் ${recipientName} க்கு அனுப்பப்படும். தயவுசெய்து உறுதிப்படுத்தவும்.`,
      te: `${amount} రూపాయలు ${recipientName} కు పంపబడతాయి. దయచేసి నిర్ధారించండి.`,
    };

    const message =
      messages[currentLanguage as keyof typeof messages] || messages.en;

    try {
      const response = await fetch("http://localhost:8000/api/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: message, language: currentLanguage }),
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        audio.onended = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(audioUrl);
        };

        await audio.play();
      } else {
        setIsPlaying(false);
      }
    } catch (error) {
      console.error("TTS Error:", error);
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setCountdown(10);
      speakConfirmation();

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0; // ⬅️ stop at 0, but don't auto-cancel
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen]);

  const handleCancel = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    onClose();
  };

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
      }, 3000);
    }
  };

  const t = translations[currentLanguage] || translations.en;

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className={`max-w-md ${isElderMode ? "max-w-lg" : ""}`}>
        <DialogHeader>
          <DialogTitle
            className={`text-center ${isElderMode ? "text-2xl" : "text-xl"}`}
          >
            {t.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Voice Animation */}
          <div className="flex justify-center">
            <div
              className={`bg-primary/10 p-6 rounded-full ${
                isListening || isPlaying ? "animate-pulse" : ""
              }`}
            >
              {isPlaying ? (
                <Volume2
                  className={`text-primary ${
                    isElderMode ? "h-16 w-16" : "h-12 w-12"
                  }`}
                />
              ) : isListening ? (
                <Mic
                  className={`text-primary ${
                    isElderMode ? "h-16 w-16" : "h-12 w-12"
                  }`}
                />
              ) : (
                <MicOff
                  className={`text-muted-foreground ${
                    isElderMode ? "h-16 w-16" : "h-12 w-12"
                  }`}
                />
              )}
            </div>
          </div>
          <div className="text-center space-y-4">
            <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
              <p
                className={`text-foreground font-medium ${
                  isElderMode ? "text-xl" : "text-lg"
                }`}
              >
                {t.sending(amount, recipientName)}
              </p>
              <p
                className={`text-primary font-bold ${
                  isElderMode ? "text-2xl" : "text-xl"
                }`}
              >
                {recipientName}
              </p>
            </div>

            <p
              className={`text-muted-foreground ${
                isElderMode ? "text-lg" : ""
              }`}
            >
              {isPlaying ? t.playing : t.confirmMessage}
            </p>

            {isListening && (
              <div className="flex items-center justify-center space-x-2 text-primary">
                <Volume2 className="h-4 w-4 animate-pulse" />
                <span className={isElderMode ? "text-lg" : ""}>
                  Listening...
                </span>
              </div>
            )}
          </div>

          <div className="text-center">
            {/* <p className={`text-muted-foreground ${isElderMode ? "text-lg" : "text-sm"}`}>
              {t.autoCancel(countdown)}
            </p> */}
          </div>

          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1 bg-transparent"
              size={isElderMode ? "lg" : "default"}
            >
              {t.cancel}
            </Button>
            <Button
              onClick={speakConfirmation}
              variant="secondary"
              className="flex-1"
              size={isElderMode ? "lg" : "default"}
              disabled={isPlaying}
            >
              <Play className="mr-2 h-4 w-4" />
              {isPlaying ? t.playing : t.replay}
            </Button>
            <Button
              onClick={onConfirm}
              className="flex-1"
              size={isElderMode ? "lg" : "default"}
            >
              {t.confirm}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
