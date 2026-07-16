import { useEffect, useState } from 'react';
import { api } from '../../api';

const ACTION_LABELS = {
  login: 'Login',
  create: 'Criação',
  update: 'Atualização',
  delete: 'Remoção',
  export: 'Exportação',
};

export default function AuditoriaAdmin() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .listAudit()
      .then((res) => setLogs(res.logs))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="admin-header">
        <h1>Auditoria</h1>
        <p>Histórico de ações realizadas no painel: quem fez o quê e quando.</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="admin-card">
        {loading ? (
          <div className="empty-state">Carregando…</div>
        ) : logs.length === 0 ? (
          <div className="empty-state">Nenhuma atividade registrada ainda.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Quando</th>
                <th>Quem</th>
                <th>Ação</th>
                <th>Onde</th>
                <th>Detalhes</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id}>
                  <td>{l.created_at}</td>
                  <td>{l.user_name || '—'}</td>
                  <td><span className="badge">{ACTION_LABELS[l.action] || l.action}</span></td>
                  <td>{l.entity}</td>
                  <td>{l.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
