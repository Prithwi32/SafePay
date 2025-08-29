import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:rapid_pay/shared/providers/shared_preferences_provider.dart';

class AppSettings {
  final bool isLoggedIn;
  final bool notificationsEnabled;
  final bool biometricEnabled;

  const AppSettings({
    this.isLoggedIn = false,
    this.notificationsEnabled = true,
    this.biometricEnabled = false,
  });

  AppSettings copyWith({
    bool? isLoggedIn,
    bool? notificationsEnabled,
    bool? biometricEnabled,
  }) {
    return AppSettings(
      isLoggedIn: isLoggedIn ?? this.isLoggedIn,
      notificationsEnabled: notificationsEnabled ?? this.notificationsEnabled,
      biometricEnabled: biometricEnabled ?? this.biometricEnabled,
    );
  }
}

class SettingsNotifier extends StateNotifier<AppSettings> {
  final SharedPreferences _prefs;
  static const _loggedInKey = 'is_logged_in';
  static const _notificationsKey = 'notifications_enabled';
  static const _biometricKey = 'biometric_enabled';

  SettingsNotifier(this._prefs)
      : super(AppSettings(
          isLoggedIn: _prefs.getBool(_loggedInKey) ?? false,
          notificationsEnabled: _prefs.getBool(_notificationsKey) ?? true,
          biometricEnabled: _prefs.getBool(_biometricKey) ?? false,
        ));

  Future<void> setLoggedIn(bool value) async {
    await _prefs.setBool(_loggedInKey, value);
    state = state.copyWith(isLoggedIn: value);
  }

  Future<void> setNotificationsEnabled(bool value) async {
    await _prefs.setBool(_notificationsKey, value);
    state = state.copyWith(notificationsEnabled: value);
  }

  Future<void> setBiometricEnabled(bool value) async {
    await _prefs.setBool(_biometricKey, value);
    state = state.copyWith(biometricEnabled: value);
  }

  Future<void> logout() async {
    await _prefs.remove(_loggedInKey);
    state = state.copyWith(isLoggedIn: false);
  }
}

final settingsProvider =
    StateNotifierProvider<SettingsNotifier, AppSettings>((ref) {
  final prefs = ref.watch(sharedPreferencesProvider);
  return SettingsNotifier(prefs);
});
