const express = require('express');
const crypto = require('crypto');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');
const { publicFormLimiter } = require('../middleware/rateLimit');
const { logAction } = require('../utils/audit');
const {
  isConfigured,
  sanitizeNewsletterHtml,
  absolutizeUploads,
  buildEmailHtml,
  sendBatch,
} = require('../utils/newsletterEmail');

const router = express.Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Escapa um valor para o CSV: aspas quando ha separadores e um apostrofo na
// frente de = + - @ para o Excel nao interpretar como formula.
function csvField(value) {
  let s = String(value ?? '');
  if (/^[=+\-@\t]/.test(s)) s = `'${s}`;
  if (/[",\n\r]/.test(s)) s = `"${s.replace(/"/g, '""')}"`;
  return s;
}

// Publico: qualquer visitante pode se inscrever pelo site (footer ou pagina de contato).
router.post('/subscribe', publicFormLimiter, (req, res) => {
  const { email, source } = req.body || {};
  if (!email || String(email).length > 254 || !EMAIL_RE.test(String(email).trim())) {
    return res.status(400).json({ error: 'Informe um e-mail valido.' });
  }

  const normalized = String(email).trim().toLowerCase();
  try {
    db.prepare('INSERT INTO newsletter_subscribers (email, source, unsubscribe_token) VALUES (?, ?, ?)').run(
      normalized,
      String(source || 'site').slice(0, 100),
      crypto.randomBytes(24).toString('hex')
    );
  } catch (err) {
    if (String(err.message).includes('UNIQUE')) {
      return res.json({ ok: true, alreadySubscribed: true });
    }
    return res.status(500).json({ error: 'Nao foi possivel salvar a inscricao.' });
  }

  res.json({ ok: true });
});

// Protegido: listar inscritos (busca opcional por e-mail).
router.get('/', requireAuth, (req, res) => {
  const { q } = req.query;
  let rows;
  if (q) {
    rows = db
      .prepare('SELECT * FROM newsletter_subscribers WHERE email LIKE ? ORDER BY created_at DESC')
      .all(`%${String(q).toLowerCase()}%`);
  } else {
    rows = db.prepare('SELECT * FROM newsletter_subscribers ORDER BY created_at DESC').all();
  }
  res.json({ subscribers: rows, total: rows.length });
});

// Protegido: exportar todos os inscritos como CSV.
router.get('/export.csv', requireAuth, (req, res) => {
  const rows = db.prepare('SELECT email, source, created_at FROM newsletter_subscribers ORDER BY created_at DESC').all();
  const header = 'email,origem,inscrito_em\n';
  const body = rows
    .map((r) => [r.email, r.source || '', r.created_at].map(csvField).join(','))
    .join('\n');

  logAction(req, { action: 'export', entity: 'newsletter', details: `Exportou ${rows.length} inscritos em CSV` });

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="newsletter-rejorc.csv"');
  res.send(header + body);
});

// ---------------------------------------------------------------------------
// Envio da newsletter (via Brevo)
// ---------------------------------------------------------------------------

// Redes sociais do rodape do site (editaveis no painel, secao "footer")
// tambem entram no rodape dos e-mails. So links http(s)/mailto validos.
function getFooterSocials() {
  try {
    const row = db.prepare("SELECT data FROM content_sections WHERE section_key = 'footer'").get();
    const data = row ? JSON.parse(row.data) : null;
    const socials = data && Array.isArray(data.socials) ? data.socials : [];
    return socials.filter(
      (s) => s && s.name && typeof s.href === 'string' && /^(https?:\/\/|mailto:)/i.test(s.href)
    );
  } catch (err) {
    return [];
  }
}

// FRONTEND_URL pode ter varias origens separadas por virgula; a primeira e
// o endereco principal do site, usado nos links dos e-mails.
function primaryFrontendUrl() {
  return process.env.FRONTEND_URL.split(',')[0].trim().replace(/\/$/, '');
}

function validateDraft(req, res) {
  if (!isConfigured()) {
    res.status(400).json({
      error: 'Envio nao configurado. Defina BREVO_API_KEY e NEWSLETTER_FROM_EMAIL no .env do backend.',
    });
    return null;
  }
  const { subject, html } = req.body || {};
  const cleanSubject = String(subject || '').trim().slice(0, 200);
  if (!cleanSubject) {
    res.status(400).json({ error: 'Informe o assunto do e-mail.' });
    return null;
  }
  const content = absolutizeUploads(sanitizeNewsletterHtml(html), process.env.API_PUBLIC_URL);
  if (!content.replace(/<[^>]*>/g, '').trim() && !content.includes('<img')) {
    res.status(400).json({ error: 'Escreva o conteudo do e-mail antes de enviar.' });
    return null;
  }
  return { subject: cleanSubject, content };
}

// Protegido: situacao da configuracao de envio (usado pela aba Enviar do painel).
router.get('/send-config', requireAuth, (req, res) => {
  const total = db.prepare('SELECT COUNT(*) as c FROM newsletter_subscribers').get().c;
  res.json({
    configured: isConfigured(),
    fromEmail: process.env.NEWSLETTER_FROM_EMAIL || null,
    fromName: process.env.NEWSLETTER_FROM_NAME || 'REJORC',
    totalSubscribers: total,
    dailyFreeLimit: 300,
  });
});

// Protegido: historico de envios.
router.get('/sends', requireAuth, (req, res) => {
  const rows = db
    .prepare(
      'SELECT id, subject, sent_by, total, sent_ok, sent_fail, is_test, created_at FROM newsletter_sends ORDER BY id DESC LIMIT 30'
    )
    .all();
  res.json({ sends: rows });
});

// Protegido: envia o rascunho apenas para o e-mail da usuaria logada.
router.post('/send-test', requireAuth, async (req, res, next) => {
  try {
    const draft = validateDraft(req, res);
    if (!draft) return;

    try {
      await sendBatch({
        subject: `[TESTE] ${draft.subject}`,
        html: buildEmailHtml(draft.content, getFooterSocials()),
        recipients: [{ email: req.user.email, params: { unsubscribeUrl: primaryFrontendUrl() } }],
      });
    } catch (err) {
      return res.status(502).json({ error: `Falha no envio de teste: ${err.message}` });
    }

    db.prepare(
      'INSERT INTO newsletter_sends (subject, body_html, sent_by, total, sent_ok, sent_fail, is_test) VALUES (?, ?, ?, 1, 1, 0, 1)'
    ).run(draft.subject, draft.content, req.user.name);
    logAction(req, { action: 'send', entity: 'newsletter', details: `Enviou teste "${draft.subject}" para ${req.user.email}` });

    res.json({ ok: true, to: req.user.email });
  } catch (err) {
    next(err);
  }
});

// Protegido: envia para todos os inscritos, em lotes, cada um com seu
// link unico de descadastro.
router.post('/send', requireAuth, async (req, res, next) => {
  try {
    const draft = validateDraft(req, res);
    if (!draft) return;

    const subs = db.prepare('SELECT id, email, unsubscribe_token FROM newsletter_subscribers ORDER BY id').all();
    if (subs.length === 0) {
      return res.status(400).json({ error: 'Nao ha nenhum inscrito na newsletter.' });
    }

    const emailHtml = buildEmailHtml(draft.content, getFooterSocials());
    const frontend = primaryFrontendUrl();
    const BATCH = 400;
    let ok = 0;
    let fail = 0;
    let lastError = null;

    for (let i = 0; i < subs.length; i += BATCH) {
      const chunk = subs.slice(i, i + BATCH);
      try {
        await sendBatch({
          subject: draft.subject,
          html: emailHtml,
          recipients: chunk.map((s) => ({
            email: s.email,
            params: { unsubscribeUrl: `${frontend}/newsletter/sair?token=${s.unsubscribe_token}` },
          })),
        });
        ok += chunk.length;
      } catch (err) {
        fail += chunk.length;
        lastError = err.message;
      }
    }

    db.prepare(
      'INSERT INTO newsletter_sends (subject, body_html, sent_by, total, sent_ok, sent_fail, is_test) VALUES (?, ?, ?, ?, ?, ?, 0)'
    ).run(draft.subject, draft.content, req.user.name, subs.length, ok, fail);
    logAction(req, {
      action: 'send',
      entity: 'newsletter',
      details: `Enviou "${draft.subject}" para ${ok} de ${subs.length} inscritos${fail ? ` (${fail} falharam)` : ''}`,
    });

    res.json({ total: subs.length, ok, fail, error: fail ? lastError : undefined });
  } catch (err) {
    next(err);
  }
});

// Publico: descadastro pelo link do e-mail.
router.post('/unsubscribe', publicFormLimiter, (req, res) => {
  const { token } = req.body || {};
  if (!token || typeof token !== 'string' || token.length > 100) {
    return res.status(400).json({ error: 'Link de descadastro invalido.' });
  }

  const sub = db.prepare('SELECT * FROM newsletter_subscribers WHERE unsubscribe_token = ?').get(token);
  if (!sub) {
    return res.status(404).json({ error: 'Link de descadastro invalido ou ja utilizado.' });
  }

  db.prepare('DELETE FROM newsletter_subscribers WHERE id = ?').run(sub.id);
  logAction(req, { action: 'delete', entity: 'newsletter', details: `Descadastro pelo link do e-mail: ${sub.email}` });
  res.json({ ok: true });
});

// Protegido: remover um inscrito.
router.delete('/:id', requireAuth, (req, res) => {
  const sub = db.prepare('SELECT * FROM newsletter_subscribers WHERE id = ?').get(req.params.id);
  if (!sub) return res.status(404).json({ error: 'Inscrito nao encontrado.' });

  db.prepare('DELETE FROM newsletter_subscribers WHERE id = ?').run(req.params.id);
  logAction(req, { action: 'delete', entity: 'newsletter', details: `Removeu inscrito ${sub.email}` });
  res.json({ ok: true });
});

module.exports = router;
