const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

router.get('/', (req, res) => {
  const { limit } = req.query;
  const max = Math.min(Number(limit) || 200, 1000);
  const rows = db
    .prepare('SELECT * FROM audit_log ORDER BY created_at DESC LIMIT ?')
    .all(max);
  res.json({ logs: rows });
});

module.exports = router;
