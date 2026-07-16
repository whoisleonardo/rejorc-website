const rateLimit = require('express-rate-limit');

// Limita tentativas de login por IP (protege contra adivinhacao de senha).
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Muitas tentativas de login. Aguarde alguns minutos e tente de novo.' },
});

// Limita envios dos formularios publicos (newsletter e contato) por IP.
const publicFormLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Muitos envios em pouco tempo. Aguarde alguns minutos e tente de novo.' },
});

module.exports = { loginLimiter, publicFormLimiter };
