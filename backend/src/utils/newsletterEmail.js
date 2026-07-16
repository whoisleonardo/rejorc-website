const sanitizeHtml = require('sanitize-html');

// URL da API do Brevo. So muda em teste (aponta para um mock local).
const BREVO_API_URL = process.env.BREVO_API_URL || 'https://api.brevo.com';

function isConfigured() {
  return Boolean(process.env.BREVO_API_KEY && process.env.NEWSLETTER_FROM_EMAIL);
}

// O HTML vem do editor do painel, mas nunca vai cru para o e-mail:
// so passam as tags de formatacao da allowlist abaixo.
function sanitizeNewsletterHtml(html) {
  return sanitizeHtml(String(html || ''), {
    allowedTags: [
      'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'a', 'ul', 'ol', 'li',
      'h1', 'h2', 'h3', 'blockquote', 'img', 'span', 'div', 'hr',
    ],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
      img: ['src', 'alt', 'width', 'height', 'style'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedStyles: {
      img: { 'max-width': [/^100%$/], height: [/^auto$/] },
    },
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', { target: '_blank', rel: 'noopener noreferrer' }),
      img: sanitizeHtml.simpleTransform('img', { style: 'max-width:100%;height:auto' }),
    },
  });
}

// Nos e-mails as imagens precisam de URL absoluta; em producao configure
// API_PUBLIC_URL com a URL publica do backend.
function absolutizeUploads(html, apiBase) {
  if (!apiBase) return html;
  const base = apiBase.replace(/\/$/, '');
  return html.replaceAll('src="/uploads/', `src="${base}/uploads/`);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// E-mail nao renderiza SVG de forma confiavel (o Gmail remove), entao as
// redes entram como emoji + nome, com link.
const SOCIAL_EMOJI = [
  [/insta/i, '📷'],
  [/mail/i, '✉️'],
  [/whats|zap/i, '💬'],
  [/you/i, '▶️'],
  [/tik/i, '🎵'],
  [/face/i, '👍'],
];

function socialLinksHtml(socials) {
  if (!socials || socials.length === 0) return '';
  const links = socials
    .map((s) => {
      const emoji = (SOCIAL_EMOJI.find(([re]) => re.test(s.name)) || [null, '🔗'])[1];
      return `<a href="${escapeHtml(s.href)}" style="color:#573B6F;font-weight:bold;text-decoration:none;white-space:nowrap;">${emoji} ${escapeHtml(s.name)}</a>`;
    })
    .join('&nbsp;&nbsp;·&nbsp;&nbsp;');
  return `<div style="text-align:center;padding:20px 8px 0;font-size:14px;">${links}</div>`;
}

// Template com a identidade do REJORC. O {{params.unsubscribeUrl}} e
// substituido pelo Brevo com o link unico de descadastro de cada pessoa.
function buildEmailHtml(contentHtml, socials = []) {
  return `<!doctype html>
<html lang="pt-BR">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#F5F1EA;">
  <div style="max-width:640px;margin:0 auto;padding:24px 16px;font-family:Arial,Helvetica,sans-serif;color:#211814;">
    <div style="background:#211814;border-radius:14px 14px 0 0;padding:22px 28px;">
      <span style="font-size:24px;font-weight:800;color:#F4B030;letter-spacing:1px;">REJORC</span>
      <span style="font-size:12px;color:#F5F1EA;display:block;margin-top:4px;">Rede de Jornalismo para a Cidadania</span>
    </div>
    <div style="background:#ffffff;padding:28px;border-radius:0 0 14px 14px;font-size:16px;line-height:1.6;">
      ${contentHtml}
    </div>
    ${socialLinksHtml(socials)}
    <div style="padding:18px 8px;text-align:center;font-size:12px;color:#6b625c;">
      Você está recebendo este e-mail porque se inscreveu na newsletter do REJORC.<br />
      <a href="{{params.unsubscribeUrl}}" style="color:#573B6F;">Não quero mais receber estes e-mails</a>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Envia um lote pelo Brevo. Cada destinatario vira uma "messageVersion"
 * com seus proprios params (link de descadastro).
 * @param {{subject: string, html: string, recipients: Array<{email: string, params: object}>}} opts
 */
async function sendBatch({ subject, html, recipients }) {
  const res = await fetch(`${BREVO_API_URL}/v3/smtp/email`, {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY,
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      sender: {
        email: process.env.NEWSLETTER_FROM_EMAIL,
        name: process.env.NEWSLETTER_FROM_NAME || 'REJORC',
      },
      subject,
      htmlContent: html,
      messageVersions: recipients.map((r) => ({ to: [{ email: r.email }], params: r.params })),
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Brevo respondeu ${res.status}: ${text.slice(0, 300)}`);
  }
  return res.json().catch(() => ({}));
}

module.exports = { isConfigured, sanitizeNewsletterHtml, absolutizeUploads, buildEmailHtml, sendBatch };
