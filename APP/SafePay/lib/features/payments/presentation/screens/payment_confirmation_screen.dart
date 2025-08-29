import 'package:flutter/material.dart';
import 'package:lottie/lottie.dart';
import 'package:rapid_pay/core/routes/app_routes.dart';
import 'package:rapid_pay/features/payments/domain/models/transaction.dart';

class PaymentConfirmationScreen extends StatefulWidget {
  final Transaction transaction;

  const PaymentConfirmationScreen({super.key, required this.transaction});

  @override
  State<PaymentConfirmationScreen> createState() =>
      _PaymentConfirmationScreenState();
}

class _PaymentConfirmationScreenState extends State<PaymentConfirmationScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    );

    _animationController.addStatusListener((status) {
      if (status == AnimationStatus.completed) {
        Future.delayed(const Duration(seconds: 1), () {
          if (mounted) {
            Navigator.pushReplacementNamed(context, AppRoutes.home);
          }
        });
      }
    });
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Lottie.asset(
                widget.transaction.status == TransactionStatus.success
                    ? 'assets/animations/payment_success.json'
                    : 'assets/animations/payment_failed.json',
                controller: _animationController,
                onLoaded: (composition) {
                  _animationController
                    ..duration = composition.duration
                    ..forward();
                },
              ),
              const SizedBox(height: 32),
              Text(
                widget.transaction.status == TransactionStatus.success
                    ? 'Payment Successful!'
                    : 'Payment Failed',
                style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                      color:
                          widget.transaction.status == TransactionStatus.success
                              ? Theme.of(context).colorScheme.primary
                              : Theme.of(context).colorScheme.error,
                      fontWeight: FontWeight.bold,
                    ),
              ),
              const SizedBox(height: 24),
              _buildTransactionDetails(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTransactionDetails() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            _buildDetailRow(
              'Amount',
              '₹${widget.transaction.amount.toStringAsFixed(2)}',
            ),
            const Divider(),
            _buildDetailRow('To', widget.transaction.receiverName),
            const Divider(),
            _buildDetailRow('Account', widget.transaction.receiverAccount),
            const Divider(),
            _buildDetailRow('Phone', '+91 ${widget.transaction.receiverPhone}'),
            const Divider(),
            _buildDetailRow(
              'Date',
              widget.transaction.createdAt.toString().split('.')[0],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: Colors.grey, fontSize: 16)),
          Text(
            value,
            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }
}
