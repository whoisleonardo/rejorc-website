import { NavLink, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { to: '/acesso/painel', label: 'Visão geral', end: true },
  { to: '/acesso/painel/conteudo', label: 'Conteúdo do site' },
  { to: '/acesso/painel/materias', label: 'Matérias' },
  { to: '/acesso/painel/fotos', label: 'Fotos & vídeos' },
  { to: '/acesso/painel/atualizacoes', label: 'Atualizações' },
  { to: '/acesso/painel/newsletter', label: 'Newsletter' },
  { to: '/acesso/painel/mensagens', label: 'Mensagens de contato' },
  { to: '/acesso/painel/usuarios', label: 'Usuários', adminOnly: true },
  { to: '/acesso/painel/auditoria', label: 'Auditoria' },
];

export default function AdminLayout() {
  const { user, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div style={{ padding: 60, textAlign: 'center' }}>Carregando…</div>;
  }
  if (!user) {
    return <Navigate to="/acesso" replace state={{ from: location.pathname }} />;
  }

  return (
    <div className="admin">
      <div className="admin-shell">
        <aside className="admin-sidebar">
          <div className="brand">
            <span style={{ fontSize: 20 }}>📰</span>
            <span>REJORC · Painel</span>
          </div>

          <nav className="admin-nav">
            {NAV.filter((item) => !item.adminOnly || user.role === 'admin').map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => (isActive ? 'active' : '')}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="admin-user-box">
            <div className="name">{user.name}</div>
            <div className="role">{user.role === 'admin' ? 'Administradora' : 'Editora'}</div>
            <button onClick={logout}>Sair</button>
          </div>
        </aside>

        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
