import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:uuid/uuid.dart';
import 'package:rapid_pay/features/payments/domain/models/transaction.dart';

class TransactionRepository {
  static const _storageKey = 'transactions';
  final SharedPreferences _prefs;
  final _uuid = const Uuid();

  TransactionRepository(this._prefs) {
    try {
      _initializeDefaultData();
    } catch (e) {
      print('Error initializing mock data: $e');
    }
  }

  static const _bankAccountsKey = 'bankAccounts';

  Future<void> _initializeDefaultData() async {
    if (!_prefs.containsKey(_storageKey)) {
      final defaultTransactions = [
        Transaction(
          id: _uuid.v4(),
          amount: 1000.0,
          receiverName: 'John Doe',
          receiverAccount: '1234567890',
          receiverPhone: '9876543210',
          status: TransactionStatus.success,
          createdAt: DateTime.now().subtract(const Duration(days: 1)),
        ),
        Transaction(
          id: _uuid.v4(),
          amount: 500.0,
          receiverName: 'Jane Smith',
          receiverAccount: '9876543210',
          receiverPhone: '9876543211',
          status: TransactionStatus.pending,
          createdAt: DateTime.now(),
        ),
      ];

      final jsonList = defaultTransactions.map((t) => t.toMap()).toList();
      await _prefs.setString(_storageKey, jsonEncode(jsonList));
    }

    if (!_prefs.containsKey(_bankAccountsKey)) {
      final defaultAccounts = [
        {
          'id': _uuid.v4(),
          'accountNumber': '1234567890',
          'bankName': 'HDFC Bank',
          'created_at': DateTime.now().millisecondsSinceEpoch,
        },
        {
          'id': _uuid.v4(),
          'accountNumber': '9876543210',
          'bankName': 'ICICI Bank',
          'created_at': DateTime.now().millisecondsSinceEpoch,
        },
      ];

      await _prefs.setString(_bankAccountsKey, jsonEncode(defaultAccounts));
    }
  }

  List<Map<String, dynamic>> getTransactions() {
    final jsonString = _prefs.getString(_storageKey);
    if (jsonString == null) return [];

    final List<dynamic> jsonList = jsonDecode(jsonString);
    return jsonList.cast<Map<String, dynamic>>();
  }

  Future<void> addTransaction(Transaction transaction) async {
    final transactions = getTransactions();
    transactions.insert(0, transaction.toMap());
    await _prefs.setString(_storageKey, jsonEncode(transactions));
  }

  List<Map<String, dynamic>> getBankAccounts() {
    final jsonString = _prefs.getString(_bankAccountsKey);
    if (jsonString == null) return [];

    final List<dynamic> jsonList = jsonDecode(jsonString);
    return jsonList.cast<Map<String, dynamic>>();
  }

  Future<void> addBankAccount(Map<String, dynamic> account) async {
    final accounts = getBankAccounts();
    account['id'] = _uuid.v4();
    account['created_at'] = DateTime.now().millisecondsSinceEpoch;
    accounts.add(account);
    await _prefs.setString(_bankAccountsKey, jsonEncode(accounts));
  }
}

final sharedPreferencesProvider = Provider<SharedPreferences>((ref) {
  throw UnimplementedError();
});

final transactionRepositoryProvider = Provider<TransactionRepository>((ref) {
  final prefs = ref.watch(sharedPreferencesProvider);
  return TransactionRepository(prefs);
});

final transactionsProvider =
    FutureProvider<List<Map<String, dynamic>>>((ref) async {
  final repository = ref.watch(transactionRepositoryProvider);
  return repository.getTransactions();
});

final bankAccountsProvider =
    FutureProvider<List<Map<String, dynamic>>>((ref) async {
  final repository = ref.watch(transactionRepositoryProvider);
  return repository.getBankAccounts();
});
