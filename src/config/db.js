import { Database } from "bun:sqlite";
import fs from "fs";
import path from "path";

/**
 * SQLite database connection & schema initialization.
 * Uses bun:sqlite (built-in with Bun) so no extra driver is required.
 */
const dbPath = process.env.DB_PATH || "./data/traffic.db";

// Ensure the directory for the db file exists
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);
db.exec("PRAGMA foreign_keys = ON;");

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS roads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    area TEXT NOT NULL,
    lat REAL,
    lng REAL,
    freeFlowSpeed INTEGER DEFAULT 30,
    createdAt TEXT DEFAULT (datetime('now')),
    updatedAt TEXT DEFAULT (datetime('now'))
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS traffic_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    roadId INTEGER NOT NULL,
    congestionLevel INTEGER NOT NULL CHECK(congestionLevel BETWEEN 0 AND 100),
    type TEXT DEFAULT 'normal' CHECK(type IN ('normal','jam','accident','roadblock')),
    source TEXT DEFAULT 'user' CHECK(source IN ('user','sensor','admin','system')),
    note TEXT DEFAULT '',
    reportedAt TEXT DEFAULT (datetime('now')),
    createdAt TEXT DEFAULT (datetime('now')),
    updatedAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (roadId) REFERENCES roads(id) ON DELETE CASCADE
  );
`);

console.log(`SQLite database ready at ${dbPath}`);

export default db;
