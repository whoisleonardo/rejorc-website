const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const TOKEN_KEY = 'rejorc_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request(path, { method = 'GET', body, auth = false, isForm = false } = {}) {
  const headers = {};
  if (!isForm) headers['Content-Type'] = 'application/json';
  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: isForm ? body : body !== undefined ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    // resposta sem corpo JSON (ex: 204)
  }

  if (!res.ok) {
    const message = (data && data.error) || `Erro ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }

  return data;
}

export const api = {
  // publico
  getAllContent: () => request('/api/content'),
  getSection: (key) => request(`/api/content/${key}`),
  subscribeNewsletter: (email, source) =>
    request('/api/newsletter/subscribe', { method: 'POST', body: { email, source } }),
  sendContactMessage: (payload) => request('/api/contact', { method: 'POST', body: payload }),

  // auth
  login: (email, password) => request('/api/auth/login', { method: 'POST', body: { email, password } }),
  me: () => request('/api/auth/me', { auth: true }),

  // conteudo (protegido)
  updateSection: (key, data) => request(`/api/content/${key}`, { method: 'PUT', auth: true, body: data }),

  // midia
  uploadImage: (file) => {
    const form = new FormData();
    form.append('file', file);
    return request('/api/media/upload', { method: 'POST', auth: true, isForm: true, body: form });
  },

  // newsletter (protegido)
  listSubscribers: (q) => request(`/api/newsletter${q ? `?q=${encodeURIComponent(q)}` : ''}`, { auth: true }),
  deleteSubscriber: (id) => request(`/api/newsletter/${id}`, { method: 'DELETE', auth: true }),
  // envio de newsletter (protegido) + descadastro (publico)
  getNewsletterSendConfig: () => request('/api/newsletter/send-config', { auth: true }),
  sendNewsletterTest: (subject, html) =>
    request('/api/newsletter/send-test', { method: 'POST', auth: true, body: { subject, html } }),
  sendNewsletter: (subject, html) =>
    request('/api/newsletter/send', { method: 'POST', auth: true, body: { subject, html } }),
  listNewsletterSends: () => request('/api/newsletter/sends', { auth: true }),
  unsubscribeNewsletter: (token) =>
    request('/api/newsletter/unsubscribe', { method: 'POST', body: { token } }),

  // O download do CSV precisa do token no header, entao baixa via fetch e
  // devolve um Blob (um link <a href> direto voltaria 401).
  exportSubscribersCsv: async () => {
    const token = getToken();
    const res = await fetch(`${API_URL}/api/newsletter/export.csv`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error(`Erro ${res.status} ao exportar o CSV.`);
    return res.blob();
  },

  // mensagens de contato (protegido)
  listMessages: () => request('/api/contact', { auth: true }),
  markMessage: (id, lida) => request(`/api/contact/${id}`, { method: 'PATCH', auth: true, body: { lida } }),
  deleteMessage: (id) => request(`/api/contact/${id}`, { method: 'DELETE', auth: true }),

  // usuarios (protegido)
  listUsers: () => request('/api/users', { auth: true }),
  createUser: (payload) => request('/api/users', { method: 'POST', auth: true, body: payload }),
  deleteUser: (id) => request(`/api/users/${id}`, { method: 'DELETE', auth: true }),

  // auditoria (protegido)
  listAudit: () => request('/api/audit', { auth: true }),

  // stats (protegido)
  getStats: () => request('/api/stats', { auth: true }),
};

export { API_URL };
