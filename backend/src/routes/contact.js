const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');
const { publicFormLimiter } = require('../middleware/rateLimit');
const { logAction } = require('../utils/audit');

const router = express.Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Publico: envio do formulario de contato do site.
router.post('/', publicFormLimiter, (req, res) => {
  const { nome, email, assunto, mensagem } = req.body || {};
  if (!nome || !email || !mensagem) {
    return res.status(400).json({ error: 'Preencha nome, e-mail e mensagem.' });
  }
  if (String(email).length > 254 || !EMAIL_RE.test(String(email).trim())) {
    return res.status(400).json({ error: 'Informe um e-mail valido.' });
  }
  if (String(nome).length > 200 || String(assunto || '').length > 200 || String(mensagem).length > 5000) {
    return res.status(400).json({ error: 'Mensagem muito longa. Reduza o texto e tente de novo.' });
  }

  db.prepare(
    'INSERT INTO contact_messages (nome, email, assunto, mensagem) VALUES (?, ?, ?, ?)'
  ).run(String(nome).trim(), String(email).trim(), assunto ? String(assunto).trim() : null, String(mensagem).trim());

  res.json({ ok: true });
});

// Protegido: listar mensagens recebidas.
router.get('/', requireAuth, (req, res) => {
  const rows = db.prepare('SELECT * FROM contact_messages ORDER BY created_at DESC').all();
  res.json({ messages: rows, total: rows.length });
});

// Protegido: marcar como lida/nao lida.
router.patch('/:id', requireAuth, (req, res) => {
  const msg = db.prepare('SELECT * FROM contact_messages WHERE id = ?').get(req.params.id);
  if (!msg) return res.status(404).json({ error: 'Mensagem nao encontrada.' });

  const lida = req.body?.lida ? 1 : 0;
  db.prepare('UPDATE contact_messages SET lida = ? WHERE id = ?').run(lida, req.params.id);
  res.json({ ok: true });
});

// Protegido: apagar mensagem.
router.delete('/:id', requireAuth, (req, res) => {
  const msg = db.prepare('SELECT * FROM contact_messages WHERE id = ?').get(req.params.id);
  if (!msg) return res.status(404).json({ error: 'Mensagem nao encontrada.' });

  db.prepare('DELETE FROM contact_messages WHERE id = ?').run(req.params.id);
  logAction(req, { action: 'delete', entity: 'mensagem_contato', details: `Removeu mensagem de ${msg.email}` });
  res.json({ ok: true });
});

module.exports = router;
