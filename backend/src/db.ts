import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(__dirname, '../../vouchers.db');
const db = new Database(dbPath, { verbose: console.log });

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS vouchers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    crew_name TEXT NOT NULL,
    crew_id TEXT NOT NULL,
    flight_number TEXT NOT NULL,
    flight_date TEXT NOT NULL,
    aircraft_type TEXT NOT NULL,
    seat1 TEXT NOT NULL,
    seat2 TEXT NOT NULL,
    seat3 TEXT NOT NULL,
    created_at TEXT NOT NULL
  )
`);

export default db;
