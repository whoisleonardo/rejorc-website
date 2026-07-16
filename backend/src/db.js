const crypto = require('crypto');
const Database = require('better-sqlite3');
const { DB_PATH } = require('./utils/paths');

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'editor', -- 'admin' | 'editor'
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS content_sections (
  section_key TEXT PRIMARY KEY,
  data TEXT NOT NULL, -- JSON
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_by TEXT
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  source TEXT DEFAULT 'site', -- onde a pessoa se inscreveu (footer, contato, etc.)
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  assunto TEXT,
  mensagem TEXT NOT NULL,
  lida INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  user_name TEXT,
  action TEXT NOT NULL,      -- ex: 'create', 'update', 'delete', 'login'
  entity TEXT NOT NULL,      -- ex: 'materia', 'usuario', 'conteudo:home_hero'
  details TEXT,              -- texto livre descrevendo o que mudou
  ip TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS newsletter_sends (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  sent_by TEXT,
  total INTEGER NOT NULL DEFAULT 0,
  sent_ok INTEGER NOT NULL DEFAULT 0,
  sent_fail INTEGER NOT NULL DEFAULT 0,
  is_test INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`);

// Migracao leve: cada inscrito ganha um token proprio de descadastro,
// usado no link "nao quero mais receber" dos e-mails.
const subsCols = db.prepare('PRAGMA table_info(newsletter_subscribers)').all();
if (!subsCols.some((c) => c.name === 'unsubscribe_token')) {
  db.exec('ALTER TABLE newsletter_subscribers ADD COLUMN unsubscribe_token TEXT');
}
const missingToken = db.prepare('SELECT id FROM newsletter_subscribers WHERE unsubscribe_token IS NULL').all();
if (missingToken.length) {
  const updateToken = db.prepare('UPDATE newsletter_subscribers SET unsubscribe_token = ? WHERE id = ?');
  for (const row of missingToken) {
    updateToken.run(crypto.randomBytes(24).toString('hex'), row.id);
  }
}

module.exports = db;
