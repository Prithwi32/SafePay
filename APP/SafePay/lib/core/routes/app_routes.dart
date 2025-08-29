import 'package:flutter/material.dart';
import 'package:rapid_pay/features/splash/presentation/splash_screen.dart';
import 'package:rapid_pay/features/auth/presentation/screens/login_screen.dart';
import 'package:rapid_pay/screens/bank_accounts/add_bank_account_screen.dart';
import 'package:rapid_pay/screens/bank_accounts/bank_accounts_screen.dart';
import 'package:rapid_pay/features/payments/presentation/screens/payment_screen.dart';
import 'package:rapid_pay/features/payments/presentation/screens/payment_confirmation_screen.dart';
import 'package:rapid_pay/features/payments/presentation/screens/transaction_history_screen.dart';
import 'package:rapid_pay/features/payments/domain/models/transaction.dart';
import 'package:rapid_pay/screens/main_scaffold.dart';
import 'package:rapid_pay/screens/onboarding_screen.dart';

class AppRoutes {
  static const String splash = '/';
  static const String onboarding = '/onboarding';
  static const String login = '/login';
  static const String home = '/home';
  static const String payment = '/payment';
  static const String confirmation = '/confirmation';
  static const String history = '/history';
  static const String addBankAccount = '/add-bank-account';
  static const String bankAccounts = '/bank-accounts';

  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case splash:
        return MaterialPageRoute(builder: (_) => const SplashScreen());
      case onboarding:
        return MaterialPageRoute(builder: (_) => const OnboardingScreen());
      case login:
        return MaterialPageRoute(builder: (_) => const LoginScreen());
      case home:
        return MaterialPageRoute(builder: (_) => const MainScaffold());
      case payment:
        return MaterialPageRoute(builder: (_) => const PaymentScreen());
      case confirmation:
        final transaction = settings.arguments as Transaction;
        return MaterialPageRoute(
          builder: (_) => PaymentConfirmationScreen(transaction: transaction),
        );
      case history:
        return MaterialPageRoute(
            builder: (_) => const TransactionHistoryScreen());
      case addBankAccount:
        return MaterialPageRoute(builder: (_) => const AddBankAccountScreen());
      case bankAccounts:
        return MaterialPageRoute(builder: (_) => BankAccountsScreen());
      default:
        return MaterialPageRoute(
          builder: (_) => Scaffold(
            body: Center(
              child: Text('No route defined for ${settings.name}'),
            ),
          ),
        );
    }
  }
}
