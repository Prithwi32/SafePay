import 'package:flutter_riverpod/flutter_riverpod.dart';

class ErrorState {
  final String message;
  final String? code;
  final DateTime timestamp;

  ErrorState({required this.message, this.code}) : timestamp = DateTime.now();
}

class ErrorNotifier extends StateNotifier<ErrorState?> {
  ErrorNotifier() : super(null);

  void setError(String message, {String? code}) {
    state = ErrorState(message: message, code: code);
  }

  void clearError() {
    state = null;
  }
}

final errorProvider = StateNotifierProvider<ErrorNotifier, ErrorState?>((ref) {
  return ErrorNotifier();
});
