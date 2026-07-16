import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useContent } from '../content/ContentContext';
import { API_URL } from '../api';

const NAV_ITEMS = [
  { to: '/', label: 'Início', end: true },
  { to: '/sobre', label: 'Sobre' },
  { to: '/materias', label: 'Matérias' },
  { to: '/midias', label: 'Mídias' },
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
  const [open, setOpen] = useState(false);

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
          className="hide-mobile"
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

        <button
          type="button"
          className="mobile-menu-btn"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: 44,
            height: 44,
            border: '2px solid #21181433',
            borderRadius: 12,
            background: 'transparent',
            color: '#211814',
            cursor: 'pointer',
            flex: 'none',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="mobile-menu" style={{ borderTop: '1.5px solid #21181422', background: '#F5F1EA', padding: '10px 20px 22px' }}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setOpen(false)}
              style={({ isActive }) => ({
                display: 'block',
                fontFamily: 'var(--font-body)',
                fontWeight: 800,
                fontSize: 16,
                textTransform: 'uppercase',
                letterSpacing: '0.01em',
                color: isActive ? '#211814' : '#211814CC',
                textDecoration: 'none',
                padding: '14px 12px',
                borderRadius: 12,
                background: isActive ? '#21181414' : 'transparent',
              })}
            >
              {item.label}
            </NavLink>
          ))}
          <Link
            to="/contato"
            onClick={() => setOpen(false)}
            style={{
              display: 'block',
              textAlign: 'center',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 16,
              color: '#211814',
              background: 'var(--gold)',
              padding: '14px 22px',
              borderRadius: 999,
              textDecoration: 'none',
              boxShadow: '0 3px 0 #21181422',
              marginTop: 12,
            }}
          >
            Assine a Newsletter
          </Link>
        </nav>
      )}
    </header>
  );
}
