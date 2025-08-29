import 'package:uuid/uuid.dart';

class BankAccount {
  final String id;
  final String accountNumber;
  final String bankName;
  final DateTime createdAt;

  BankAccount({
    String? id,
    required this.accountNumber,
    required this.bankName,
    DateTime? createdAt,
  }) : id = id ?? const Uuid().v4(),
       createdAt = createdAt ?? DateTime.now();

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'account_number': accountNumber,
      'bank_name': bankName,
      'created_at': createdAt.millisecondsSinceEpoch,
    };
  }

  factory BankAccount.fromMap(Map<String, dynamic> map) {
    return BankAccount(
      id: map['id'],
      accountNumber: map['account_number'],
      bankName: map['bank_name'],
      createdAt: DateTime.fromMillisecondsSinceEpoch(map['created_at']),
    );
  }
}
