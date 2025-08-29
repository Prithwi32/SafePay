import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pin_code_fields/pin_code_fields.dart';
import 'package:rapid_pay/core/routes/app_routes.dart';
import 'package:rapid_pay/core/storage/secure_storage_helper.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _phoneController = TextEditingController();
  final _otpController = TextEditingController();
  final _pinController = TextEditingController();
  bool _showOtpField = false;
  bool _showPinSetup = false;

  @override
  void dispose() {
    _phoneController.dispose();
    _otpController.dispose();
    _pinController.dispose();
    super.dispose();
  }

  void _handlePhoneSubmit() {
    if (_phoneController.text.length == 10) {
      setState(() {
        _showOtpField = true;
      });
      // TODO: Implement OTP sending logic
    }
  }

  void _handleOtpSubmit() {
    if (_otpController.text.length == 6) {
      setState(() {
        _showPinSetup = true;
      });
    }
  }

  Future<void> _handlePinSubmit() async {
    if (_pinController.text.length == 4) {
      try {
        final storage = SecureStorageHelper();
        await storage.storePin(_pinController.text);
        await storage.storePhoneNumber(_phoneController.text);

        if (mounted) {
          Navigator.pushReplacementNamed(context, AppRoutes.home);
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Error saving credentials: $e')),
          );
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                'Welcome to SafePay',
                style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
              ),
              const SizedBox(height: 48),
              if (!_showOtpField && !_showPinSetup) ...[
                TextField(
                  controller: _phoneController,
                  keyboardType: TextInputType.phone,
                  maxLength: 10,
                  decoration: const InputDecoration(
                    labelText: 'Phone Number',
                    prefixText: '+91 ',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 24),
                ElevatedButton(
                  onPressed: _handlePhoneSubmit,
                  child: const Text('Send OTP'),
                ),
              ],
              if (_showOtpField && !_showPinSetup) ...[
                PinCodeTextField(
                  appContext: context,
                  length: 6,
                  controller: _otpController,
                  onCompleted: (_) => _handleOtpSubmit(),
                  pinTheme: PinTheme(
                    shape: PinCodeFieldShape.box,
                    borderRadius: BorderRadius.circular(8),
                    fieldHeight: 50,
                    fieldWidth: 40,
                    activeFillColor: Colors.white,
                  ),
                ),
              ],
              if (_showPinSetup) ...[
                const Text(
                  'Set up your 4-digit PIN',
                  style: TextStyle(fontSize: 16),
                ),
                const SizedBox(height: 24),
                PinCodeTextField(
                  appContext: context,
                  length: 4,
                  controller: _pinController,
                  onCompleted: (_) => _handlePinSubmit(),
                  obscureText: true,
                  pinTheme: PinTheme(
                    shape: PinCodeFieldShape.box,
                    borderRadius: BorderRadius.circular(8),
                    fieldHeight: 50,
                    fieldWidth: 50,
                    activeFillColor: Colors.white,
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
