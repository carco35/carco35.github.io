import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'builder-readiness.sqlite');

declare global {
  // eslint-disable-next-line no-var
  var __brpDb: Database.Database | undefined;
}

function createConnection(): Database.Database {
  const database = new Database(dbPath);
  database.pragma('journal_mode = WAL');
  database.exec(`
    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      profile_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      worked_for TEXT,
      outcome TEXT,
      timeframe TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (profile_id) REFERENCES profiles(id)
    );

    CREATE TABLE IF NOT EXISTS skills (
      id TEXT PRIMARY KEY,
      profile_id TEXT NOT NULL,
      skill_name TEXT NOT NULL,
      FOREIGN KEY (profile_id) REFERENCES profiles(id)
    );

    CREATE TABLE IF NOT EXISTS vouches (
      id TEXT PRIMARY KEY,
      profile_id TEXT NOT NULL,
      vouch_link_token TEXT NOT NULL UNIQUE,
      submitter_name TEXT,
      relationship TEXT,
      question_1_response TEXT,
      question_2_response TEXT,
      question_3_response TEXT,
      created_at TEXT NOT NULL,
      submitted_at TEXT,
      FOREIGN KEY (profile_id) REFERENCES profiles(id)
    );

    CREATE TABLE IF NOT EXISTS plaid_items (
      id TEXT PRIMARY KEY,
      profile_id TEXT NOT NULL,
      access_token TEXT NOT NULL,
      item_id TEXT NOT NULL,
      transactions_summary TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (profile_id) REFERENCES profiles(id)
    );

    CREATE TABLE IF NOT EXISTS synthesized_profiles (
      id TEXT PRIMARY KEY,
      profile_id TEXT NOT NULL,
      summary TEXT NOT NULL,
      strengths TEXT NOT NULL,
      still_developing TEXT NOT NULL,
      readiness_tier TEXT NOT NULL,
      generated_at TEXT NOT NULL,
      FOREIGN KEY (profile_id) REFERENCES profiles(id)
    );

    CREATE TABLE IF NOT EXISTS opportunity_drafts (
      id TEXT PRIMARY KEY,
      profile_id TEXT NOT NULL,
      opportunity_slug TEXT NOT NULL,
      draft_content TEXT NOT NULL,
      generated_at TEXT NOT NULL,
      FOREIGN KEY (profile_id) REFERENCES profiles(id)
    );
  `);
  return database;
}

export function getDb(): Database.Database {
  if (!global.__brpDb) {
    global.__brpDb = createConnection();
  }
  return global.__brpDb;
}

export function newId(): string {
  return crypto.randomUUID();
}

export function nowIso(): string {
  return new Date().toISOString();
}
