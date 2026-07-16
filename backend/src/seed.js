require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./db');
const { defaultContent } = require('./defaultContent');

function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL || 'admin@rejorc.ufpr.br').toLowerCase();
  const name = process.env.ADMIN_NAME || 'Administradora REJORC';
  const password = process.env.ADMIN_PASSWORD || 'troque-esta-senha-123';

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    console.log(`Usuario admin "${email}" ja existe, nada a fazer.`);
    return;
  }

  const hash = bcrypt.hashSync(password, 10);
  db.prepare(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)'
  ).run(name, email, hash, 'admin');

  console.log(`Usuario admin criado: ${email} (senha definida em ADMIN_PASSWORD no .env)`);
}

function seedContent() {
  const insert = db.prepare(
    `INSERT INTO content_sections (section_key, data, updated_by)
     VALUES (@key, @data, 'seed')
     ON CONFLICT(section_key) DO NOTHING`
  );
  const tx = db.transaction((entries) => {
    for (const [key, value] of entries) {
      insert.run({ key, data: JSON.stringify(value) });
    }
  });
  tx(Object.entries(defaultContent));
  console.log('Conteudo padrao verificado/inserido.');
}

seedAdmin();
seedContent();
console.log('Seed concluido.');
