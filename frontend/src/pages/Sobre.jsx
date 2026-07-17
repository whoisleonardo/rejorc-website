import { Link } from 'react-router-dom';
import { useContent } from '../content/ContentContext';
import MediaBlock from '../components/MediaBlock';

export default function Sobre() {
  const { content } = useContent();
  const s = content.sobre || {};
  const stats = s.stats || [];
  const missao = s.missao || [];
  const passos = s.passos || [];

  return (
    <div>
      <section className="container grid-2" style={{ padding: '40px 32px 64px', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 48, alignItems: 'center' }}>
        <div>
          <div style={{ display: 'inline-block', fontWeight: 800, fontSize: 13, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--purple)', background: '#573B6F1A', padding: '8px 16px', borderRadius: 999, marginBottom: 22 }}>
            {s.badge}
          </div>
          <h1 style={{ font: '800 46px/1.1 var(--font-display)', margin: '0 0 20px' }}>{s.title}</h1>
          <p style={{ fontSize: 18, lineHeight: 1.65, color: '#211814B3', margin: 0 }}>{s.text}</p>
        </div>
        <MediaBlock media={s.image} alt="Equipe do REJORC" style={{ height: 300 }} radius={22} placeholderLabel="[ foto: equipe do REJORC ]" />
      </section>

      <section className="container grid-3" style={{ padding: '40px 32px 96px', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
        {stats.map((st, i) => (
          <div key={i} style={{ background: '#FFF', border: '1.5px solid #21181414', borderRadius: 20, padding: '30px 26px', textAlign: 'center' }}>
            <div style={{ font: '800 40px var(--font-display)', color: st.color }}>{st.value}</div>
            <div style={{ fontWeight: 700, fontSize: 14.5, color: '#211814AA', marginTop: 6 }}>{st.label}</div>
          </div>
        ))}
      </section>

      <section style={{ background: 'var(--ink)', padding: '88px 32px' }}>
        <div className="container" style={{ padding: 0 }}>
          <h2 style={{ font: '700 32px var(--font-display)', color: '#F5F1EA', margin: '0 0 44px' }}>Nossa missão</h2>
          <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 40 }}>
            {missao.map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: m.color, flex: 'none' }} />
                <div>
                  <h3 style={{ font: '700 19px var(--font-display)', color: '#F5F1EA', margin: '0 0 8px' }}>{m.title}</h3>
                  <p style={{ fontSize: 15, lineHeight: 1.6, color: '#F5F1EAAA', margin: 0 }}>{m.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container" style={{ padding: '96px 32px' }}>
        <h2 style={{ font: '700 32px var(--font-display)', margin: '0 0 44px' }}>Como funciona</h2>
        <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
          {passos.map((p, i) => (
            <div key={i} style={{ position: 'relative', paddingTop: 20 }}>
              <div style={{ font: '800 15px var(--font-display)', color: '#F5F1EA', background: p.color, width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                {p.n}
              </div>
              <h3 style={{ font: '700 18px var(--font-display)', margin: '0 0 8px' }}>{p.title}</h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.6, color: '#21181499', margin: 0 }}>{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container" style={{ margin: '0 auto 96px', padding: '0 32px' }}>
        <div className="grid-2" style={{ background: '#37805414', border: '1.5px solid #37805440', borderRadius: 24, padding: 48, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 32, alignItems: 'center' }}>
          <div>
            <h2 style={{ font: '800 27px var(--font-display)', margin: '0 0 12px' }}>{s.ctaTitle}</h2>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: '#211814B3', margin: 0 }}>{s.ctaText}</p>
          </div>
          <Link to="/contato" style={{ justifySelf: 'end', font: '700 16px var(--font-display)', color: '#F5F1EA', background: 'var(--green)', padding: '15px 28px', borderRadius: 999, textDecoration: 'none', whiteSpace: 'nowrap' }}>
            {s.ctaButtonLabel}
          </Link>
        </div>
      </section>
    </div>
  );
}
