import { Link } from 'react-router-dom';
import { useContent } from '../content/ContentContext';
import { API_URL } from '../api';
import NewsletterForm from './NewsletterForm';
import SocialIcon from './SocialIcon';

const NAV_ITEMS = [
  { to: '/', label: 'Início' },
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

export default function Footer() {
  const { content } = useContent();
  const footer = content.footer || {};
  const site = content.site || {};
  const socials = footer.socials || [];
  const logoUrl = site.logoFooter?.url;
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: 'var(--purple)', color: '#F5F1EA', fontFamily: 'var(--font-body)' }}>
      <div
        className="container grid-3"
        style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr', gap: 48, padding: '72px 32px 40px' }}
      >
        <div>
          {logoUrl ? (
            <img src={resolveUrl(logoUrl)} alt={site.siteName || 'REJORC'} style={{ height: 44, width: 'auto', display: 'block', marginBottom: 18 }} />
          ) : (
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, marginBottom: 18 }}>{site.siteName || 'REJORC'}</div>
          )}
          <p style={{ fontSize: 15.5, lineHeight: 1.6, color: '#F5F1EACC', maxWidth: 360, margin: '0 0 24px' }}>
            {footer.description}
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            {socials
              .filter((s) => s.href && s.href !== '#')
              .map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  title={s.name}
                  aria-label={s.name}
                  target={s.href?.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 999,
                    background: '#F5F1EA1A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none',
                    color: '#F5F1EA',
                  }}
                >
                  <SocialIcon name={s.name} size={18} />
                </a>
              ))}
          </div>
        </div>

        <div>
          <div style={{ font: '700 15px var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--gold)', marginBottom: 16 }}>
            Navegue
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {NAV_ITEMS.map((item) => (
              <Link key={item.to} to={item.to} style={{ color: '#F5F1EAE0', textDecoration: 'none', fontSize: 15, fontWeight: 600 }}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div style={{ font: '700 15px var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--gold)', marginBottom: 16 }}>
            Newsletter mensal
          </div>
          <p style={{ fontSize: 14.5, lineHeight: 1.6, color: '#F5F1EACC', margin: '0 0 16px' }}>
            Receba as atualizações do projeto direto no seu e-mail, uma vez por mês.
          </p>
          <NewsletterForm source="footer" dark style={{ flexDirection: 'column', maxWidth: 380 }} />
        </div>
      </div>

      <div style={{ borderTop: '1px solid #F5F1EA26' }}>
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 10,
            padding: '20px 32px',
          }}
        >
          <div style={{ fontSize: 13.5, color: '#F5F1EA99' }}>
            © {year} {site.siteName || 'REJORC'} · {site.tagline || 'Rede de Jornalismo para a Cidadania'} · UFPR
          </div>
          <div style={{ fontSize: 13.5, color: '#F5F1EA99' }}>Feito por estudantes, para a comunidade.</div>
        </div>
      </div>
    </footer>
  );
}
