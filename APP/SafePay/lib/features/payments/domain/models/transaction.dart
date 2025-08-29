import 'package:uuid/uuid.dart';

enum TransactionStatus { success, failed, pending }

class Transaction {
  final String id;
  final double amount;
  final String receiverName;
  final String receiverAccount;
  final String receiverPhone;
  final TransactionStatus status;
  final DateTime createdAt;

  Transaction({
    String? id,
    required this.amount,
    required this.receiverName,
    required this.receiverAccount,
    required this.receiverPhone,
    required this.status,
    DateTime? createdAt,
  }) : id = id ?? const Uuid().v4(),
       createdAt = createdAt ?? DateTime.now();

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'amount': amount,
      'receiver_name': receiverName,
      'receiver_account': receiverAccount,
      'receiver_phone': receiverPhone,
      'status': status.name,
      'created_at': createdAt.millisecondsSinceEpoch,
    };
  }

  factory Transaction.fromMap(Map<String, dynamic> map) {
    return Transaction(
      id: map['id'],
      amount: map['amount'],
      receiverName: map['receiver_name'],
      receiverAccount: map['receiver_account'],
      receiverPhone: map['receiver_phone'],
      status: TransactionStatus.values.firstWhere(
        (e) => e.name == map['status'],
        orElse: () => TransactionStatus.pending,
      ),
      createdAt: DateTime.fromMillisecondsSinceEpoch(map['created_at']),
    );
  }
}
