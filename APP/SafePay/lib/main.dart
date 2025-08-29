import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:rapid_pay/shared/providers/language_provider.dart';
import 'package:rapid_pay/shared/providers/mock_data_provider.dart'
    as mock_data;
import 'package:rapid_pay/shared/providers/theme_provider.dart';
import 'package:rapid_pay/shared/providers/settings_provider.dart';
import 'package:rapid_pay/shared/providers/shared_preferences_provider.dart';
import 'package:rapid_pay/core/routes/app_routes.dart';
import 'package:rapid_pay/core/theme/app_theme.dart';
import 'package:rapid_pay/shared/widgets/global_scaffold_messenger.dart';
import 'package:rapid_pay/shared/widgets/loading_overlay.dart';

void main() async {
  try {
    print('Starting app initialization...');
    WidgetsFlutterBinding.ensureInitialized();
    print('Flutter binding initialized');

    // Initialize Hive for additional caching if needed
    await Hive.initFlutter();
    print('Hive initialized');

    // Initialize SharedPreferences
    final prefs = await SharedPreferences.getInstance();
    print('SharedPreferences initialized');

    // Run app with provider overrides
    runApp(
      ProviderScope(
        overrides: [
          sharedPreferencesProvider.overrideWithValue(prefs),
          mock_data.sharedPreferencesProvider.overrideWithValue(prefs),
        ],
        child: const MyApp(),
      ),
    );
    print('App started successfully');
  } catch (e, stackTrace) {
    print('Error during initialization: $e\n$stackTrace');
    // Show error widget instead of crashing
    runApp(
      MaterialApp(
        theme: ThemeData(
          colorScheme: ColorScheme.fromSeed(seedColor: Colors.red),
          useMaterial3: true,
        ),
        home: Scaffold(
          body: SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(
                    Icons.error_outline,
                    color: Colors.red,
                    size: 64,
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Initialization Error',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Error details: $e',
                    style: const TextStyle(color: Colors.red),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 24),
                  ElevatedButton(
                    onPressed: () {
                      main();
                    },
                    child: const Text('Retry'),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer(
      builder: (context, ref, _) {
        final language = ref.watch(languageProvider);
        final themeMode = ref.watch(themeProvider);
        // Initialize TTS language handler
        ref.watch(ttsLanguageHandler);

        return MaterialApp(
          title: 'SafePay',
          theme: AppTheme.lightTheme,
          darkTheme: AppTheme.darkTheme,
          themeMode: themeMode,
          builder: (context, child) => LoadingOverlay(
            child: GlobalScaffoldMessenger(
              child: child!,
            ),
          ),
          initialRoute: AppRoutes.splash,
          onGenerateRoute: AppRoutes.generateRoute,
          debugShowCheckedModeBanner: false,
          locale: Locale(language.code),
          supportedLocales: AppLanguage.values.map((lang) => Locale(lang.code)),
          localizationsDelegates: [
            GlobalMaterialLocalizations.delegate,
            GlobalWidgetsLocalizations.delegate,
            GlobalCupertinoLocalizations.delegate,
          ],
        );
      },
    );
  }
}
