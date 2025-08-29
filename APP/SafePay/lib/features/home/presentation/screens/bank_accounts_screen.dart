import 'package:flutter/material.dart';
import 'package:rapid_pay/core/database/database_helper.dart';
import 'package:rapid_pay/features/home/domain/models/bank_account.dart';

class BankAccountsScreen extends StatelessWidget {
  final DatabaseHelper _databaseHelper = DatabaseHelper();

  BankAccountsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Your Bank Accounts')),
      body: FutureBuilder<List<Map<String, dynamic>>>(
        future: _databaseHelper.getBankAccounts(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return Center(
              child: Text(
                'Error: ${snapshot.error}',
                style: TextStyle(color: Theme.of(context).colorScheme.error),
              ),
            );
          }

          final accounts =
              snapshot.data?.map(BankAccount.fromMap).toList() ?? [];

          if (accounts.isEmpty) {
            return const Center(child: Text('No bank accounts added yet'));
          }

          return ListView.builder(
            padding: const EdgeInsets.all(8),
            itemCount: accounts.length,
            itemBuilder: (context, index) {
              final account = accounts[index];
              return Card(
                child: ListTile(
                  leading: const CircleAvatar(
                    child: Icon(Icons.account_balance),
                  ),
                  title: Text(
                    account.bankName,
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                  subtitle: Text(
                    'A/C: ${_maskAccountNumber(account.accountNumber)}',
                  ),
                ),
              );
            },
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.pushNamed(context, '/add-bank-account');
        },
        child: const Icon(Icons.add),
      ),
    );
  }

  String _maskAccountNumber(String accountNumber) {
    if (accountNumber.length <= 4) return accountNumber;
    final lastFour = accountNumber.substring(accountNumber.length - 4);
    final maskedPart = '*' * (accountNumber.length - 4);
    return '$maskedPart$lastFour';
  }
}
