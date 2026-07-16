import { useState } from 'react';
import { api } from '../api';

export default function NewsletterForm({ source = 'site', dark = false, style }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | done | error

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email) return;
    setStatus('sending');
    try {
      await api.subscribeNewsletter(email, source);
      setStatus('done');
    } catch (err) {
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <div
        style={{
          background: dark ? '#37805440' : '#37805418',
          border: `1.5px solid ${dark ? '#378054' : '#37805440'}`,
          borderRadius: 12,
          padding: '14px 16px',
          fontSize: 14.5,
          fontWeight: 700,
          color: dark ? '#F5F1EA' : '#378054',
          ...style,
        }}
      >
        ✓ Inscrição confirmada. Bem-vindo(a)!
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, width: '100%', ...style }}>
      <input
        type="email"
        required
        placeholder="seu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          flex: 1,
          fontFamily: 'var(--font-body)',
          fontSize: 15,
          padding: '13px 16px',
          borderRadius: 999,
          border: 'none',
          outline: 'none',
          background: dark ? 'var(--bg)' : '#fff',
          color: '#211814',
        }}
      />
      <button
        type="submit"
        disabled={status === 'sending'}
        style={{
          font: '700 15px var(--font-display)',
          color: dark ? '#211814' : '#F5F1EA',
          background: dark ? 'var(--gold)' : 'var(--ink)',
          padding: '13px 22px',
          borderRadius: 999,
          border: 'none',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        {status === 'sending' ? 'Enviando…' : 'Assinar'}
      </button>
      {status === 'error' && (
        <div style={{ position: 'absolute', marginTop: 46, fontSize: 12.5, color: '#C0392B' }}>
          Não foi possível assinar agora. Tente novamente.
        </div>
      )}
    </form>
  );
}
