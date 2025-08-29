import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class StorageService {
  static final StorageService _instance = StorageService._internal();
  late final SharedPreferences _prefs;

  factory StorageService() => _instance;

  StorageService._internal();

  Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
  }

  Future<void> setItem(String key, dynamic value) async {
    final jsonString = json.encode(value);
    await _prefs.setString(key, jsonString);
  }

  dynamic getItem(String key) {
    final jsonString = _prefs.getString(key);
    if (jsonString == null) return null;
    return json.decode(jsonString);
  }

  Future<void> removeItem(String key) async {
    await _prefs.remove(key);
  }

  Future<void> clear() async {
    await _prefs.clear();
  }
}
