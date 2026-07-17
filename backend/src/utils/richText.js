const sanitizeHtml = require('sanitize-html');

// Sanitiza o HTML do editor de materias antes de salvar. Esse conteudo e
// exibido no site publico, entao so passam tags/estilos de formatacao —
// nada de script, iframe ou atributos de evento.
function sanitizeArticleHtml(html) {
  return sanitizeHtml(String(html || ''), {
    allowedTags: [
      'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'a', 'ul', 'ol', 'li',
      'h1', 'h2', 'h3', 'h4', 'blockquote', 'img', 'span', 'div', 'hr', 'sub', 'sup',
    ],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
      img: ['src', 'alt', 'width', 'height', 'style'],
      li: ['data-list', 'class'],
      '*': ['class', 'style'],
    },
    // So classes do proprio editor (alinhamento, recuo, etc.)
    allowedClasses: { '*': [/^ql-/] },
    allowedStyles: {
      '*': {
        color: [/^#[0-9a-fA-F]{3,8}$/, /^rgba?\([\d\s.,%]+\)$/],
        'background-color': [/^#[0-9a-fA-F]{3,8}$/, /^rgba?\([\d\s.,%]+\)$/],
        'text-align': [/^(left|right|center|justify)$/],
      },
      img: { 'max-width': [/^100%$/], height: [/^auto$/] },
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', { target: '_blank', rel: 'noopener noreferrer' }),
    },
  });
}

module.exports = { sanitizeArticleHtml };
