import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api';

export default function Overview() {
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.getStats(), api.listAudit()])
      .then(([s, a]) => {
        setStats(s);
        setLogs(a.logs.slice(0, 6));
      })
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div>
      <div className="admin-header">
        <h1>Visão geral</h1>
        <p>Um resumo rápido do que está acontecendo no site.</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {stats && (
        <div className="stat-grid">
          <div className="stat-box">
            <div className="value">{stats.subscribers}</div>
            <div className="label">Inscritos na newsletter</div>
          </div>
          <div className="stat-box">
            <div className="value">{stats.recentSubscribers}</div>
            <div className="label">Novos inscritos (30 dias)</div>
          </div>
          <div className="stat-box">
            <div className="value">{stats.unreadMessages}</div>
            <div className="label">Mensagens não lidas</div>
          </div>
          <div className="stat-box">
            <div className="value">{stats.users}</div>
            <div className="label">Usuárias com acesso</div>
          </div>
        </div>
      )}

      <div className="admin-card">
        <h2>Atalhos</h2>
        <p className="hint">Comece por aqui.</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link className="btn btn-outline" to="/acesso/painel/conteudo">Editar conteúdo do site</Link>
          <Link className="btn btn-outline" to="/acesso/painel/materias">Gerenciar matérias</Link>
          <Link className="btn btn-outline" to="/acesso/painel/newsletter">Ver inscritos</Link>
          <Link className="btn btn-outline" to="/acesso/painel/mensagens">Ver mensagens</Link>
        </div>
      </div>

      <div className="admin-card">
        <h2>Atividade recente</h2>
        <p className="hint">Últimas ações registradas na auditoria.</p>
        {logs.length === 0 ? (
          <div className="empty-state">Nenhuma atividade registrada ainda.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Quando</th>
                <th>Quem</th>
                <th>O que</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id}>
                  <td>{l.created_at}</td>
                  <td>{l.user_name}</td>
                  <td>{l.details || `${l.action} · ${l.entity}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div style={{ marginTop: 14 }}>
          <Link to="/acesso/painel/auditoria" className="btn btn-sm btn-outline">Ver auditoria completa →</Link>
        </div>
      </div>
    </div>
  );
}
