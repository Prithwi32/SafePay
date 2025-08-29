import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:rapid_pay/core/services/tts_service.dart';
import 'package:rapid_pay/shared/providers/shared_preferences_provider.dart';

enum AppLanguage {
  english('English', 'en'),
  hindi('हिंदी', 'hi'),
  kannada('ಕನ್ನಡ', 'kn'),
  tamil('தமிழ்', 'ta'),
  telugu('తెలుగు', 'te'),
  marathi('मराठी', 'mr'),
  bengali('বাংলা', 'bn');

  final String name;
  final String code;
  const AppLanguage(this.name, this.code);
}

class LanguageNotifier extends StateNotifier<AppLanguage> {
  final SharedPreferences _prefs;

  LanguageNotifier(this._prefs) : super(AppLanguage.english) {
    final savedLanguage = _prefs.getString('language');
    if (savedLanguage != null) {
      state = AppLanguage.values.firstWhere(
        (lang) => lang.code == savedLanguage,
        orElse: () => AppLanguage.english,
      );
    }
  }

  Future<void> setLanguage(AppLanguage language) async {
    await _prefs.setString('language', language.code);
    state = language;
  }

  Locale get locale => Locale(state.code);
}

final languageProvider =
    StateNotifierProvider<LanguageNotifier, AppLanguage>((ref) {
  final prefs = ref.watch(sharedPreferencesProvider);
  return LanguageNotifier(prefs);
});

// Create a separate provider to handle TTS language updates
final ttsLanguageHandler = Provider((ref) {
  final tts = ref.watch(ttsServiceProvider);

  ref.listen<AppLanguage>(languageProvider, (previous, next) {
    if (previous?.code != next.code) {
      tts.setLanguage(next.code);
    }
  });

  return null;
});
