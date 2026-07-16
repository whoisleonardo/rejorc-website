const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const multer = require('multer');
const { requireAuth } = require('../middleware/auth');
const { logAction } = require('../utils/audit');

const router = express.Router();

const { UPLOAD_DIR } = require('../utils/paths');
const ALLOWED_MIME = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif']);
// Extensao permitida -> tipo real esperado (jpg e jpeg sao o mesmo formato).
const EXT_TO_TYPE = { '.png': 'png', '.jpg': 'jpeg', '.jpeg': 'jpeg', '.webp': 'webp', '.gif': 'gif' };

// O mimetype e o nome do arquivo vem do navegador e podem ser falsificados,
// entao alem do filtro abaixo os primeiros bytes do arquivo sao conferidos
// depois de salvo (sniffImageType) — se nao for uma imagem de verdade, apaga.
function sniffImageType(buf) {
  if (buf.length >= 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'png';
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpeg';
  if (buf.length >= 6 && ['GIF87a', 'GIF89a'].includes(buf.subarray(0, 6).toString('ascii'))) return 'gif';
  if (buf.length >= 12 && buf.subarray(0, 4).toString('ascii') === 'RIFF' && buf.subarray(8, 12).toString('ascii') === 'WEBP') return 'webp';
  return null;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = crypto.randomBytes(16).toString('hex');
    cb(null, `${name}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_MIME.has(file.mimetype) || !(ext in EXT_TO_TYPE)) {
      return cb(new Error('Formato de imagem nao suportado. Use PNG, JPG, WEBP ou GIF.'));
    }
    cb(null, true);
  },
});

// Protegido: upload de uma imagem. Retorna a URL publica para usar no conteudo.
router.post('/upload', requireAuth, (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
    }

    const ext = path.extname(req.file.filename).toLowerCase();
    let realType = null;
    try {
      const fd = fs.openSync(req.file.path, 'r');
      const head = Buffer.alloc(12);
      fs.readSync(fd, head, 0, 12, 0);
      fs.closeSync(fd);
      realType = sniffImageType(head);
    } catch (e) {
      realType = null;
    }
    if (realType !== EXT_TO_TYPE[ext]) {
      fs.unlink(req.file.path, () => {});
      return res.status(400).json({ error: 'O arquivo enviado nao e uma imagem valida (PNG, JPG, WEBP ou GIF).' });
    }

    const url = `/uploads/${req.file.filename}`;
    logAction(req, { action: 'create', entity: 'media', details: `Upload de imagem ${req.file.filename}` });
    res.json({ url, mimetype: req.file.mimetype, size: req.file.size });
  });
});

module.exports = router;
