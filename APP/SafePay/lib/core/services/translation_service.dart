import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:rapid_pay/shared/providers/language_provider.dart';
import 'package:rapid_pay/core/services/number_formatter.dart';

class TranslationService {
  static String getPaymentMessage(
      String amount, String name, String languageCode) {
    // Convert amount to words in the appropriate language
    final amountInWords = NumberFormatter.convertToWords(amount, languageCode);

    switch (languageCode) {
      case 'hi':
        // Hindi: Natural word order with amount in words
        return 'आप $name को $amountInWords भेज रहे हैं। क्या आप पुष्टि करना चाहेंगे?';
      case 'kn':
        // Kannada: Natural flow with proper formal tone
        return 'ನೀವು $name ಅವರಿಗೆ $amountInWords ಕಳುಹಿಸಲು ಬಯಸುತ್ತೀರಾ? ದಯವಿಟ್ಟು ದೃಢೀಕರಿಸಿ.';
      case 'ta':
        // Tamil: Clear and formal with proper word placement
        return '$name அவர்களுக்கு $amountInWords அனுப்ப விரும்புகிறீர்களா? உறுதிப்படுத்தவும்.';
      case 'te':
        // Telugu: Natural flow with respectful tone
        return 'మీరు $name గారికి $amountInWords పంపాలనుకుంటున్నారా? దయచేసి నిర్ధారించండి.';
      case 'mr':
        // Marathi: Clear pronunciation with formal tone
        return 'तुम्ही $name यांना $amountInWords पाठवू इच्छिता? कृपया पुष्टी करा.';
      case 'bn':
        // Bengali: Natural flow with proper formal tone
        return 'আপনি কি $name কে $amountInWords পাঠাতে চান? অনুগ্রহ করে নিশ্চিত করুন।';
      default:
        // English: Natural flow with amount in words
        return 'Would you like to send $amountInWords to $name? Please confirm.';
    }
  }
}

final translationServiceProvider = Provider<TranslationService>((ref) {
  return TranslationService();
});
