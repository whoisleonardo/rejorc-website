const fs = require('fs');
const path = require('path');

// Em desenvolvimento os dados ficam na propria pasta backend/ (data.sqlite e
// uploads/), como sempre. Em producao, defina DATA_DIR (ex: /data) para que
// banco e uploads fiquem num volume persistente, fora do codigo.
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', '..');
const UPLOAD_DIR = path.join(DATA_DIR, 'uploads');

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// As imagens padrao do site (logo, ilustracoes) vem junto com o codigo em
// uploads/seed. Quando DATA_DIR aponta para outro lugar, copia-as para la
// na primeira subida.
const repoSeedDir = path.join(__dirname, '..', '..', 'uploads', 'seed');
const targetSeedDir = path.join(UPLOAD_DIR, 'seed');
if (repoSeedDir !== targetSeedDir && fs.existsSync(repoSeedDir) && !fs.existsSync(targetSeedDir)) {
  fs.cpSync(repoSeedDir, targetSeedDir, { recursive: true });
}

module.exports = {
  DATA_DIR,
  UPLOAD_DIR,
  DB_PATH: path.join(DATA_DIR, 'data.sqlite'),
};
