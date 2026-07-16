require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/auth');
const contentRoutes = require('./routes/content');
const mediaRoutes = require('./routes/media');
const newsletterRoutes = require('./routes/newsletter');
const contactRoutes = require('./routes/contact');
const usersRoutes = require('./routes/users');
const auditRoutes = require('./routes/audit');
const statsRoutes = require('./routes/stats');

if (!process.env.JWT_SECRET) {
  console.error('ERRO: defina JWT_SECRET no arquivo .env antes de iniciar o servidor.');
  process.exit(1);
}
if (!process.env.FRONTEND_URL) {
  console.error('ERRO: defina FRONTEND_URL no arquivo .env (URL do site, usada no CORS).');
  process.exit(1);
}

const app = express();

// Em producao a API fica atras de proxy; isso faz req.ip refletir o IP real
// do visitante (usado no rate limit e na auditoria). TRUST_PROXY = numero de
// proxies na frente (1 = Caddy do compose; 2 = Caddy externo + o do compose).
app.set('trust proxy', Number(process.env.TRUST_PROXY || 1));

// Headers de seguranca. CORP "cross-origin" permite que o site (outro dominio)
// carregue as imagens de /uploads.
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// FRONTEND_URL aceita mais de uma origem separada por virgula
// (ex: site na Vercel + site servido pelo proprio backend).
app.use(
  cors({
    origin: process.env.FRONTEND_URL.split(',').map((s) => s.trim()).filter(Boolean),
  })
);
app.use(express.json({ limit: '2mb' }));

// Arquivos enviados pela gestora (imagens do site) ficam publicos aqui.
const { UPLOAD_DIR } = require('./utils/paths');
app.use('/uploads', express.static(UPLOAD_DIR));

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/stats', statsRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Rota nao encontrada.' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Erro interno do servidor.' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API do REJORC rodando em http://localhost:${PORT}`);
});
