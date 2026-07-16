const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { logAction } = require('../utils/audit');

const router = express.Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Todas as rotas de usuarios exigem login e papel admin (editoras nao
// gerenciam nem veem a lista de usuarias).
router.use(requireAuth, requireAdmin);

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT id, name, email, role, created_at FROM users ORDER BY created_at ASC').all();
  res.json({ users: rows });
});

router.post('/', async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Preencha nome, e-mail e senha.' });
    }
    if (!EMAIL_RE.test(String(email).trim())) {
      return res.status(400).json({ error: 'E-mail invalido.' });
    }
    if (String(password).length < 8) {
      return res.status(400).json({ error: 'A senha precisa ter pelo menos 8 caracteres.' });
    }
    const finalRole = role === 'admin' ? 'admin' : 'editor';
    const normalizedEmail = String(email).trim().toLowerCase();

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail);
    if (existing) {
      return res.status(409).json({ error: 'Ja existe um usuario com esse e-mail.' });
    }

    const hash = await bcrypt.hash(String(password), 10);
    const info = db
      .prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)')
      .run(String(name).trim(), normalizedEmail, hash, finalRole);

    logAction(req, { action: 'create', entity: 'usuario', details: `Criou usuario ${normalizedEmail} (${finalRole})` });

    const user = db.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const target = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  if (!target) return res.status(404).json({ error: 'Usuario nao encontrado.' });

  if (id === req.user.id) {
    return res.status(400).json({ error: 'Voce nao pode apagar o proprio usuario enquanto estiver logada com ele.' });
  }

  const adminCount = db.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'admin'").get().c;
  if (target.role === 'admin' && adminCount <= 1) {
    return res.status(400).json({ error: 'Precisa existir pelo menos um usuario administrador.' });
  }

  db.prepare('DELETE FROM users WHERE id = ?').run(id);
  logAction(req, { action: 'delete', entity: 'usuario', details: `Removeu usuario ${target.email}` });
  res.json({ ok: true });
});

module.exports = router;
