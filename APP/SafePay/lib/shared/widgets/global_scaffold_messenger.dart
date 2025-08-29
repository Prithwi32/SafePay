import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:rapid_pay/shared/providers/error_provider.dart';

class GlobalScaffoldMessenger extends ConsumerStatefulWidget {
  final Widget child;

  const GlobalScaffoldMessenger({super.key, required this.child});

  @override
  ConsumerState<GlobalScaffoldMessenger> createState() =>
      _GlobalScaffoldMessengerState();
}

class _GlobalScaffoldMessengerState
    extends ConsumerState<GlobalScaffoldMessenger> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.listenManual(errorProvider, (previous, next) {
        if (next != null && mounted) {
          _showErrorSnackBar(next);
        }
      });
    });
  }

  void _showErrorSnackBar(ErrorState error) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(error.message),
        backgroundColor: Theme.of(context).colorScheme.error,
        behavior: SnackBarBehavior.floating,
        action: SnackBarAction(
          label: 'Dismiss',
          textColor: Colors.white,
          onPressed: () {
            ScaffoldMessenger.of(context).hideCurrentSnackBar();
          },
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return widget.child;
  }
}
