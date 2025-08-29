import 'package:flutter/foundation.dart';
import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';
import 'package:sqflite_common_ffi_web/sqflite_ffi_web.dart';

class DatabaseHelper {
  static final DatabaseHelper _instance = DatabaseHelper._internal();
  static Database? _database;

  factory DatabaseHelper() => _instance;

  DatabaseHelper._internal();

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDatabase();
    return _database!;
  }

  Future<Database> _initDatabase() async {
    if (kIsWeb) {
      // Use databaseFactoryFfiWeb for web platform
      var factory = databaseFactoryFfiWeb;
      return await factory.openDatabase(
        'rapid_pay.db',
        options: OpenDatabaseOptions(version: 1, onCreate: _onCreate),
      );
    } else {
      // Use regular SQLite for mobile platforms
      final path = join(await getDatabasesPath(), 'rapid_pay.db');
      return await openDatabase(path, version: 1, onCreate: _onCreate);
    }
  }

  Future<void> _onCreate(Database db, int version) async {
    // Create tables
    await db.execute('''
      CREATE TABLE bank_accounts (
        id TEXT PRIMARY KEY,
        account_number TEXT NOT NULL,
        bank_name TEXT NOT NULL,
        created_at INTEGER NOT NULL
      )
    ''');

    await db.execute('''
      CREATE TABLE transactions (
        id TEXT PRIMARY KEY,
        amount REAL NOT NULL,
        receiver_name TEXT NOT NULL,
        receiver_account TEXT NOT NULL,
        receiver_phone TEXT NOT NULL,
        status TEXT NOT NULL,
        created_at INTEGER NOT NULL
      )
    ''');
  }

  // Bank Account Methods
  Future<void> insertBankAccount(Map<String, dynamic> account) async {
    final db = await database;
    await db.insert('bank_accounts', account);
  }

  Future<List<Map<String, dynamic>>> getBankAccounts() async {
    final db = await database;
    return await db.query('bank_accounts', orderBy: 'created_at DESC');
  }

  // Transaction Methods
  Future<void> insertTransaction(Map<String, dynamic> transaction) async {
    final db = await database;
    await db.insert('transactions', transaction);
  }

  Future<List<Map<String, dynamic>>> getTransactions() async {
    final db = await database;
    return await db.query('transactions', orderBy: 'created_at DESC');
  }
}
