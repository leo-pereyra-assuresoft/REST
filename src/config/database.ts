import Database from 'better-sqlite3';
import { config } from 'dotenv';
import path from 'path';

config();

const dbPath = path.join(__dirname, '../../data/database.sqlite');

// Create database directory if it doesn't exist
import fs from 'fs';
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

export default db; 