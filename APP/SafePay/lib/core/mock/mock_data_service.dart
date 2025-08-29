import 'package:uuid/uuid.dart';
import '../storage/storage_service.dart';

class MockDataService {
  static const String _bankAccountsKey = 'bank_accounts';
  static const String _transactionsKey = 'transactions';
  final StorageService _storage = StorageService();
  final _uuid = const Uuid();

  // Bank Account Methods
  Future<void> addBankAccount(Map<String, dynamic> account) async {
    final accounts = await getBankAccounts();
    account['id'] = _uuid.v4();
    account['created_at'] = DateTime.now().millisecondsSinceEpoch;
    accounts.add(account);
    await _storage.setItem(_bankAccountsKey, accounts);
  }

  Future<List<Map<String, dynamic>>> getBankAccounts() async {
    final accounts = _storage.getItem(_bankAccountsKey);
    return accounts != null ? List<Map<String, dynamic>>.from(accounts) : [];
  }

  // Transaction Methods
  Future<void> addTransaction(Map<String, dynamic> transaction) async {
    final transactions = await getTransactions();
    transaction['id'] = _uuid.v4();
    transaction['created_at'] = DateTime.now().millisecondsSinceEpoch;
    transactions.add(transaction);
    await _storage.setItem(_transactionsKey, transactions);
  }

  Future<List<Map<String, dynamic>>> getTransactions() async {
    final transactions = _storage.getItem(_transactionsKey);
    return transactions != null
        ? List<Map<String, dynamic>>.from(transactions)
        : [];
  }

  // Mock Data Generation
  Future<void> initializeMockData() async {
    // Add mock bank accounts if none exist
    final accounts = await getBankAccounts();
    if (accounts.isEmpty) {
      await addBankAccount({
        'account_number': '1234567890',
        'bank_name': 'HDFC Bank',
      });
      await addBankAccount({
        'account_number': '9876543210',
        'bank_name': 'ICICI Bank',
      });
    }

    // Add mock transactions if none exist
    final transactions = await getTransactions();
    if (transactions.isEmpty) {
      await addTransaction({
        'amount': 1000.0,
        'receiver_name': 'John Doe',
        'receiver_account': '1234567890',
        'receiver_phone': '+91 9876543210',
        'status': 'completed',
      });
      await addTransaction({
        'amount': 500.0,
        'receiver_name': 'Jane Smith',
        'receiver_account': '9876543210',
        'receiver_phone': '+91 9876543211',
        'status': 'pending',
      });
    }
  }
}
