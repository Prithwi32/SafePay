import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:rapid_pay/core/routes/app_routes.dart';
import 'package:rapid_pay/core/services/tts_service.dart';
import 'package:rapid_pay/core/services/translation_service.dart';
import 'package:rapid_pay/features/payments/domain/models/transaction.dart';
import 'package:rapid_pay/shared/providers/language_provider.dart';

class PaymentScreen extends ConsumerStatefulWidget {
  const PaymentScreen({super.key});

  @override
  ConsumerState<PaymentScreen> createState() => _PaymentScreenState();
}

class _PaymentScreenState extends ConsumerState<PaymentScreen> {
  final _formKey = GlobalKey<FormState>();
  final _accountController = TextEditingController();
  final _phoneController = TextEditingController();
  final _nameController = TextEditingController();
  final _amountController = TextEditingController();
  final _pinController = TextEditingController();
  bool _showPinDialog = false;

  @override
  void dispose() {
    _accountController.dispose();
    _phoneController.dispose();
    _nameController.dispose();
    _amountController.dispose();
    _pinController.dispose();
    super.dispose();
  }

  void _handleSubmit() async {
    if (_formKey.currentState!.validate()) {
      final language = ref.read(languageProvider);
      final tts = ref.read(ttsServiceProvider);

      // Set language for TTS
      await tts.setLanguage(language.code);

      // Prepare payment details text
      final amount = double.parse(_amountController.text);
      final message = TranslationService.getPaymentMessage(
        amount.toStringAsFixed(2),
        _nameController.text,
        language.code,
      );

      // Speak the payment details
      await tts.speak(message);

      // Show PIN dialog after speaking
      setState(() {
        _showPinDialog = true;
      });
    }
  }

  void _handlePinSubmit() {
    // TODO: Validate PIN
    final transaction = Transaction(
      amount: double.parse(_amountController.text),
      receiverName: _nameController.text,
      receiverAccount: _accountController.text,
      receiverPhone: _phoneController.text,
      status: TransactionStatus.success,
    );

    // Navigate to confirmation screen
    Navigator.pushReplacementNamed(
      context,
      AppRoutes.confirmation,
      arguments: transaction,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Pay')),
      body: Stack(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Form(
              key: _formKey,
              child: ListView(
                children: [
                  TextFormField(
                    controller: _accountController,
                    decoration: const InputDecoration(
                      labelText: 'Account Number',
                      border: OutlineInputBorder(),
                    ),
                    keyboardType: TextInputType.number,
                    inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter account number';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: _phoneController,
                    decoration: const InputDecoration(
                      labelText: 'Phone Number',
                      border: OutlineInputBorder(),
                      prefixText: '+91 ',
                    ),
                    keyboardType: TextInputType.phone,
                    maxLength: 10,
                    validator: (value) {
                      if (value == null || value.length != 10) {
                        return 'Please enter valid phone number';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: _nameController,
                    decoration: const InputDecoration(
                      labelText: 'Recipient Name',
                      border: OutlineInputBorder(),
                    ),
                    textCapitalization: TextCapitalization.words,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter recipient name';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: _amountController,
                    decoration: const InputDecoration(
                      labelText: 'Amount (₹)',
                      border: OutlineInputBorder(),
                    ),
                    keyboardType: TextInputType.number,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter amount';
                      }
                      final amount = double.tryParse(value);
                      if (amount == null || amount <= 0) {
                        return 'Please enter valid amount';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 32),
                  ElevatedButton(
                    onPressed: _handleSubmit,
                    child: const Text('Continue'),
                  ),
                ],
              ),
            ),
          ),
          if (_showPinDialog)
            Center(
              child: Card(
                margin: const EdgeInsets.all(32),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Text(
                        'Enter PIN',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 16),
                      TextField(
                        controller: _pinController,
                        decoration: const InputDecoration(
                          border: OutlineInputBorder(),
                        ),
                        keyboardType: TextInputType.number,
                        obscureText: true,
                        maxLength: 4,
                        textAlign: TextAlign.center,
                        onChanged: (value) {
                          if (value.length == 4) {
                            _handlePinSubmit();
                          }
                        },
                      ),
                    ],
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
