import { Link, NavLink } from 'react-router-dom';
import { useContent } from '../content/ContentContext';
import { API_URL } from '../api';

const NAV_ITEMS = [
  { to: '/', label: 'Início', end: true },
  { to: '/sobre', label: 'Sobre' },
  { to: '/materias', label: 'Matérias' },
  { to: '/fotos', label: 'Fotos' },
  { to: '/atualizacoes', label: 'Atualizações' },
  { to: '/contato', label: 'Contato' },
];

function resolveUrl(url) {
  if (!url) return '';
  return url.startsWith('http') ? url : `${API_URL}${url}`;
}

export default function Header() {
  const { content } = useContent();
  const site = content.site || {};
  const logoUrl = site.logoHeader?.url;

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: '#F5F1EAE6',
        backdropFilter: 'blur(8px)',
        borderBottom: '2px solid #21181422',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
          height: 84,
        }}
      >
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flex: 'none' }}>
          {logoUrl ? (
            <img src={resolveUrl(logoUrl)} alt={site.siteName || 'REJORC'} style={{ height: 40, width: 'auto', display: 'block' }} />
          ) : (
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22 }}>{site.siteName || 'REJORC'}</span>
          )}
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }} className="hide-mobile">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              style={({ isActive }) => ({
                fontFamily: 'var(--font-body)',
                fontWeight: 800,
                fontSize: 14.5,
                letterSpacing: '0.01em',
                textTransform: 'uppercase',
                color: isActive ? '#211814' : '#211814CC',
                textDecoration: 'none',
                padding: '10px 14px',
                borderRadius: 999,
                background: isActive ? '#21181414' : 'transparent',
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Link
          to="/contato"
          style={{
            flex: 'none',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 15,
            color: '#211814',
            background: 'var(--gold)',
            padding: '12px 22px',
            borderRadius: 999,
            textDecoration: 'none',
            boxShadow: '0 3px 0 #21181422',
          }}
        >
          Assine a Newsletter
        </Link>
      </div>
    </header>
  );
}
