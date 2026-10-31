// Generated with Antigravity (AI), reviewed and understood by me. Part of CIS046-3 Assignment 1.

// Third-party dependency: better-sqlite3 (documented in docs/REFERENCES.md)
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Ensure the data directory exists before initializing SQLite
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'banana.db');
const db = new Database(dbPath);

// Enable WAL mode for better concurrency and enforce foreign key constraints
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    score INTEGER NOT NULL,
    difficulty TEXT NOT NULL,
    correct_answers INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

module.exports = db;
