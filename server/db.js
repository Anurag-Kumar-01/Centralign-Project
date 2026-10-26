import Database from 'better-sqlite3';

export function initDatabase(dbPath = './centralign_erp.sqlite') {
  const db = new Database(dbPath);

  db.exec(`
    CREATE TABLE IF NOT EXISTS invoices (
      id TEXT PRIMARY KEY,
      invoice_number TEXT UNIQUE NOT NULL,
      vendor TEXT NOT NULL,
      amount REAL NOT NULL,
      due_date TEXT NOT NULL,
      category TEXT NOT NULL,
      status TEXT NOT NULL,
      verified_by TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS vendors (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      email TEXT NOT NULL,
      payment_terms TEXT NOT NULL,
      bank_account TEXT NOT NULL,
      status TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS agent_audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_goal TEXT NOT NULL,
      stage TEXT NOT NULL,
      tool TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  return db;
}
