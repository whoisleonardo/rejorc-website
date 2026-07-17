const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');
const { logAction } = require('../utils/audit');
const { sanitizeArticleHtml } = require('../utils/richText');
const { defaultContent } = require('../defaultContent');

const router = express.Router();

const VALID_KEYS = new Set(Object.keys(defaultContent));

function readSection(key) {
  const row = db.prepare('SELECT data FROM content_sections WHERE section_key = ?').get(key);
  // Mescla com o conteudo padrao: campos novos adicionados ao codigo depois
  // do site ja estar no ar aparecem preenchidos, sem precisar de migracao.
  if (row) return { ...(defaultContent[key] || {}), ...JSON.parse(row.data) };
  return defaultContent[key] ?? null;
}

// Publico: todo o conteudo do site de uma vez (usado pelo front publico).
router.get('/', (req, res) => {
  const all = {};
  for (const key of VALID_KEYS) {
    all[key] = readSection(key);
  }
  res.json(all);
});

// Publico: uma secao especifica.
router.get('/:key', (req, res) => {
  const { key } = req.params;
  if (!VALID_KEYS.has(key)) {
    return res.status(404).json({ error: `Secao "${key}" nao existe.` });
  }
  res.json({ key, data: readSection(key) });
});

// Protegido: atualizar uma secao inteira.
router.put('/:key', requireAuth, (req, res) => {
  const { key } = req.params;
  if (!VALID_KEYS.has(key)) {
    return res.status(404).json({ error: `Secao "${key}" nao existe.` });
  }
  const data = req.body;
  if (data === undefined || data === null || typeof data !== 'object') {
    return res.status(400).json({ error: 'Corpo da requisicao invalido.' });
  }

  // O texto completo das materias vira HTML no site publico — sanitiza aqui.
  if (key === 'materias' && Array.isArray(data.items)) {
    data.items = data.items.map((item) =>
      item && typeof item === 'object'
        ? { ...item, body: item.body ? sanitizeArticleHtml(item.body) : '' }
        : item
    );
  }

  db.prepare(
    `INSERT INTO content_sections (section_key, data, updated_by, updated_at)
     VALUES (?, ?, ?, datetime('now'))
     ON CONFLICT(section_key) DO UPDATE SET data = excluded.data, updated_by = excluded.updated_by, updated_at = excluded.updated_at`
  ).run(key, JSON.stringify(data), req.user.name);

  logAction(req, { action: 'update', entity: `conteudo:${key}`, details: `Secao "${key}" atualizada` });

  res.json({ key, data });
});

module.exports = router;
