import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api';

const emptyForm = { name: '', email: '', password: '', role: 'editor' };

export default function UsuariosAdmin() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  function load() {
    setLoading(true);
    api
      .listUsers()
      .then((res) => setUsers(res.users))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  if (user.role !== 'admin') {
    return (
      <div>
        <div className="admin-header">
          <h1>Usuários</h1>
        </div>
        <div className="admin-card">
          <p>Apenas administradoras podem gerenciar usuários.</p>
        </div>
      </div>
    );
  }

  async function handleCreate(e) {
    e.preventDefault();
    setCreating(true);
    setError('');
    try {
      const res = await api.createUser(form);
      setUsers((u) => [...u, res.user]);
      setForm(emptyForm);
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Remover o acesso desta pessoa?')) return;
    setDeletingId(id);
    try {
      await api.deleteUser(id);
      setUsers((u) => u.filter((x) => x.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="admin-header">
        <h1>Usuários</h1>
        <p>Quem tem acesso ao painel de gestão do site.</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="admin-card">
        <h2>Adicionar usuária</h2>
        <p className="hint">Administradoras podem gerenciar tudo, incluindo outros usuários. Editoras podem editar conteúdo, mas não gerenciar usuários.</p>
        <form onSubmit={handleCreate}>
          <div className="field-row">
            <div className="field">
              <label>Nome</label>
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="field">
              <label>E-mail</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label>Senha (mínimo 8 caracteres)</label>
              <input type="password" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <div className="field">
              <label>Papel</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="editor">Editora (edita conteúdo)</option>
                <option value="admin">Administradora (acesso total)</option>
              </select>
            </div>
          </div>
          <button className="btn btn-primary" disabled={creating}>
            {creating ? 'Criando…' : 'Criar usuária'}
          </button>
        </form>
      </div>

      <div className="admin-card">
        <h2>Usuárias com acesso</h2>
        {loading ? (
          <div className="empty-state">Carregando…</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Papel</th>
                <th>Desde</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role === 'admin' ? <span className="badge badge-admin">Administradora</span> : <span className="badge">Editora</span>}</td>
                  <td>{u.created_at}</td>
                  <td>
                    {u.id !== user.id && (
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(u.id)} disabled={deletingId === u.id}>
                        {deletingId === u.id ? 'Removendo…' : 'Remover'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
