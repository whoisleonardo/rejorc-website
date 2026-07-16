import { useEffect, useState } from 'react';
import { api } from '../../api';

export default function MensagensAdmin() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);

  function load() {
    setLoading(true);
    api
      .listMessages()
      .then((res) => setMessages(res.messages))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleLida(msg) {
    setBusyId(msg.id);
    try {
      await api.markMessage(msg.id, !msg.lida);
      setMessages((msgs) => msgs.map((m) => (m.id === msg.id ? { ...m, lida: m.lida ? 0 : 1 } : m)));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Apagar esta mensagem?')) return;
    setBusyId(id);
    try {
      await api.deleteMessage(id);
      setMessages((msgs) => msgs.filter((m) => m.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div className="admin-header">
        <h1>Mensagens de contato</h1>
        <p>Mensagens enviadas pelo formulário da página "Contato".</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="admin-card">
        {loading ? (
          <div className="empty-state">Carregando…</div>
        ) : messages.length === 0 ? (
          <div className="empty-state">Nenhuma mensagem recebida ainda.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {messages.map((m) => (
              <div key={m.id} style={{ border: '1.5px solid #21181414', borderRadius: 14, padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
                  <div>
                    <strong>{m.nome}</strong>{' '}
                    <span style={{ color: '#21181499' }}>&lt;{m.email}&gt;</span>{' '}
                    {!m.lida && <span className="badge badge-unread">Não lida</span>}
                  </div>
                  <div style={{ fontSize: 13, color: '#21181480' }}>{m.created_at}</div>
                </div>
                {m.assunto && <div style={{ fontSize: 13, fontWeight: 700, color: '#21181499', marginBottom: 6 }}>Assunto: {m.assunto}</div>}
                <p style={{ margin: '0 0 12px', fontSize: 15, lineHeight: 1.55, whiteSpace: 'pre-line' }}>{m.mensagem}</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-sm btn-outline" onClick={() => toggleLida(m)} disabled={busyId === m.id}>
                    {m.lida ? 'Marcar como não lida' : 'Marcar como lida'}
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(m.id)} disabled={busyId === m.id}>
                    Apagar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
