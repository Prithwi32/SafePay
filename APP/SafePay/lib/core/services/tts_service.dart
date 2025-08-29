import 'package:flutter_tts/flutter_tts.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class TTSService {
  final FlutterTts _flutterTts = FlutterTts();
  String _currentLanguage = 'en-US';

  Future<void> setLanguage(String languageCode) async {
    String langCode;
    switch (languageCode) {
      case 'hi':
        langCode = 'hi-IN';
        break;
      case 'kn':
        langCode = 'kn-IN';
        break;
      case 'ta':
        langCode = 'ta-IN';
        break;
      case 'te':
        langCode = 'te-IN';
        break;
      case 'mr':
        langCode = 'mr-IN';
        break;
      case 'bn':
        langCode = 'bn-IN';
        break;
      default:
        langCode = 'en-US';
    }

    if (_currentLanguage != langCode) {
      await _flutterTts.setLanguage(langCode);
      _currentLanguage = langCode;
    }
  }

  Future<void> speak(String text) async {
    await _flutterTts.speak(text);
  }

  Future<void> stop() async {
    await _flutterTts.stop();
  }
}

final ttsServiceProvider = Provider<TTSService>((ref) {
  return TTSService();
});
