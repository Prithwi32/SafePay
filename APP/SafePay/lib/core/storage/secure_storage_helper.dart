import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureStorageHelper {
  static final SecureStorageHelper _instance = SecureStorageHelper._internal();
  static const _storage = FlutterSecureStorage();

  factory SecureStorageHelper() => _instance;

  SecureStorageHelper._internal();

  // Store PIN
  Future<void> storePin(String pin) async {
    await _storage.write(key: 'pin', value: pin);
  }

  // Get PIN
  Future<String?> getPin() async {
    return await _storage.read(key: 'pin');
  }

  // Store Phone Number
  Future<void> storePhoneNumber(String phoneNumber) async {
    await _storage.write(key: 'phone_number', value: phoneNumber);
  }

  // Get Phone Number
  Future<String?> getPhoneNumber() async {
    return await _storage.read(key: 'phone_number');
  }

  // Check if user is logged in
  Future<bool> isLoggedIn() async {
    final phoneNumber = await getPhoneNumber();
    final pin = await getPin();
    return phoneNumber != null && pin != null;
  }

  // Clear all data (for logout)
  Future<void> clearAll() async {
    await _storage.deleteAll();
  }
}
