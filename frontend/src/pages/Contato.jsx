import { useState } from 'react';
import { useContent } from '../content/ContentContext';
import { api } from '../api';
import NewsletterForm from '../components/NewsletterForm';

const ASSUNTOS = ['Sugestão de pauta', 'Quero participar', 'Parceria', 'Outro'];

export default function Contato() {
  const { content } = useContent();
  const c = content.contato || {};
  const [form, setForm] = useState({ nome: '', email: '', assunto: ASSUNTOS[0], mensagem: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  function setField(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      await api.sendContactMessage(form);
      setSent(true);
    } catch (err) {
      setError('Não foi possível enviar sua mensagem agora. Tente novamente em instantes.');
    } finally {
      setSending(false);
    }
  }

  return (
    <div>
      <section className="container" style={{ padding: '72px 32px 24px' }}>
        <div style={{ display: 'inline-block', fontWeight: 800, fontSize: 13, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--purple)', background: '#573B6F1A', padding: '8px 16px', borderRadius: 999, marginBottom: 20 }}>
          {c.badge}
        </div>
        <h1 style={{ font: '800 44px var(--font-display)', margin: '0 0 16px' }}>{c.title}</h1>
        <p style={{ fontSize: 17, lineHeight: 1.6, color: '#211814B3', maxWidth: 640, margin: 0 }}>{c.subtitle}</p>
      </section>

      <section className="container grid-2" style={{ padding: '24px 32px 96px', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 40 }}>
        <div style={{ background: '#FFF', border: '1.5px solid #21181414', borderRadius: 22, padding: 40 }}>
          {sent ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 14, padding: '30px 0' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#37805426', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>✓</div>
              <h3 style={{ font: '700 22px var(--font-display)', margin: 0 }}>Mensagem enviada!</h3>
              <p style={{ fontSize: 15, color: '#21181499', margin: 0 }}>Obrigado pelo contato — vamos responder em breve.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {error && <div className="alert alert-error">{error}</div>}
              <div className="field-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 8, fontWeight: 700, fontSize: 13.5, color: '#21181499' }}>
                  Nome
                  <input required type="text" value={form.nome} onChange={setField('nome')} style={inputStyle} />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: 8, fontWeight: 700, fontSize: 13.5, color: '#21181499' }}>
                  E-mail
                  <input required type="email" value={form.email} onChange={setField('email')} style={inputStyle} />
                </label>
              </div>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 8, fontWeight: 700, fontSize: 13.5, color: '#21181499' }}>
                Assunto
                <select value={form.assunto} onChange={setField('assunto')} style={{ ...inputStyle, background: '#fff' }}>
                  {ASSUNTOS.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 8, fontWeight: 700, fontSize: 13.5, color: '#21181499' }}>
                Mensagem
                <textarea required rows={5} value={form.mensagem} onChange={setField('mensagem')} style={{ ...inputStyle, resize: 'vertical' }} />
              </label>
              <button
                type="submit"
                disabled={sending}
                style={{ alignSelf: 'flex-start', font: '700 16px var(--font-display)', color: '#F5F1EA', background: 'var(--ink)', padding: '14px 28px', borderRadius: 999, border: 'none', cursor: 'pointer' }}
              >
                {sending ? 'Enviando…' : 'Enviar mensagem'}
              </button>
            </form>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: 'var(--purple)', borderRadius: 20, padding: 32, color: '#F5F1EA' }}>
            <h3 style={{ font: '700 19px var(--font-display)', margin: '0 0 14px' }}>Onde estamos</h3>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: '#F5F1EAD9', margin: 0, whiteSpace: 'pre-line' }}>{c.address}</p>
          </div>
          <div style={{ background: '#FFF', border: '1.5px solid #21181414', borderRadius: 20, padding: 32 }}>
            <h3 style={{ font: '700 19px var(--font-display)', margin: '0 0 14px' }}>Contato direto</h3>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: '#21181499', margin: 0 }}>
              {c.email}
              <br />
              {c.instagram}
            </p>
          </div>
        </div>
      </section>

      <section className="container" style={{ margin: '0 auto 96px', padding: '0 32px' }}>
        <div className="grid-2" style={{ background: 'var(--gold)', borderRadius: 28, padding: '56px 48px', display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 32, alignItems: 'center' }}>
          <div>
            <h2 style={{ font: '800 28px var(--font-display)', color: '#211814', margin: '0 0 12px' }}>Assine a newsletter mensal</h2>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: '#211814CC', margin: 0 }}>Receba as atualizações do REJORC direto no seu e-mail, uma vez por mês.</p>
          </div>
          <NewsletterForm source="contato" style={{ justifySelf: 'end', maxWidth: 380 }} />
        </div>
      </section>
    </div>
  );
}

const inputStyle = {
  fontSize: 15,
  padding: '13px 14px',
  borderRadius: 10,
  border: '1.5px solid #21181426',
  outline: 'none',
  fontFamily: 'var(--font-body)',
};
