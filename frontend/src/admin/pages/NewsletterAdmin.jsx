import { useEffect, useState } from 'react';
import { api } from '../../api';
import NewsletterSendTab from '../components/NewsletterSendTab';

export default function NewsletterAdmin() {
  const [tab, setTab] = useState('inscritos');
  const [subscribers, setSubscribers] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  function load(query) {
    setLoading(true);
    api
      .listSubscribers(query)
      .then((res) => setSubscribers(res.subscribers))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load('');
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    load(q);
  }

  async function handleExport() {
    try {
      const blob = await api.exportSubscribersCsv();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'newsletter-rejorc.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Remover este e-mail da lista da newsletter?')) return;
    setDeletingId(id);
    try {
      await api.deleteSubscriber(id);
      setSubscribers((subs) => subs.filter((s) => s.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="admin-header">
        <h1>Newsletter</h1>
        <p>E-mails cadastrados pelo site — e envio da newsletter para a lista.</p>
      </div>

      <div className="tabs">
        <button type="button" className={tab === 'inscritos' ? 'active' : ''} onClick={() => setTab('inscritos')}>
          Inscritos
        </button>
        <button type="button" className={tab === 'enviar' ? 'active' : ''} onClick={() => setTab('enviar')}>
          Enviar newsletter
        </button>
      </div>

      {tab === 'enviar' ? (
        <NewsletterSendTab />
      ) : (
        <>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 18 }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8 }}>
            <input type="text" placeholder="Buscar por e-mail…" value={q} onChange={(e) => setQ(e.target.value)} style={{ minWidth: 220, padding: '10px 12px', borderRadius: 10, border: '1.5px solid #21181426' }} />
            <button type="submit" className="btn btn-outline btn-sm">Buscar</button>
          </form>
          <button type="button" className="btn btn-gold btn-sm" onClick={handleExport}>
            ⬇ Exportar CSV
          </button>
        </div>

        {loading ? (
          <div className="empty-state">Carregando…</div>
        ) : subscribers.length === 0 ? (
          <div className="empty-state">Nenhum inscrito encontrado.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>E-mail</th>
                <th>Origem</th>
                <th>Inscrito em</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s) => (
                <tr key={s.id}>
                  <td>{s.email}</td>
                  <td>{s.source}</td>
                  <td>{s.created_at}</td>
                  <td>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(s.id)} disabled={deletingId === s.id}>
                      {deletingId === s.id ? 'Removendo…' : 'Remover'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
        </>
      )}
    </div>
  );
}
