import { Link } from 'react-router-dom';
import { useContent } from '../content/ContentContext';
import MediaBlock from '../components/MediaBlock';

export default function Home() {
  const { content } = useContent();
  const hero = content.home_hero || {};
  const pillars = content.pillars?.items || [];
  const project = content.current_project || {};
  const materias = (content.materias?.items || []).slice(0, 3);
  const fotos = (content.fotos?.items || []).slice(0, 5);
  const newsletterCta = content.newsletter_cta || {};

  return (
    <div>
      {/* HERO */}
      <section
        className="container grid-2"
        style={{ padding: '88px 32px 96px', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 56, alignItems: 'center' }}
      >
        <div>
          <div
            style={{
              display: 'inline-block',
              fontWeight: 800,
              fontSize: 13,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--purple)',
              background: '#573B6F1A',
              padding: '8px 16px',
              borderRadius: 999,
              marginBottom: 22,
            }}
          >
            {hero.badge}
          </div>
          <h1 style={{ font: '800 56px/1.05 var(--font-display)', color: '#211814', margin: '0 0 24px' }}>{hero.title}</h1>
          <p style={{ fontSize: 19, lineHeight: 1.65, color: '#211814B3', maxWidth: 520, margin: '0 0 36px' }}>{hero.subtitle}</p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Link
              to="/sobre"
              style={{ font: '700 16px var(--font-display)', color: '#F5F1EA', background: 'var(--ink)', padding: '15px 26px', borderRadius: 999, textDecoration: 'none' }}
            >
              {hero.ctaPrimaryLabel}
            </Link>
            <Link
              to="/materias"
              style={{ font: '700 16px var(--font-display)', color: '#211814', border: '2px solid #21181433', padding: '13px 26px', borderRadius: 999, textDecoration: 'none' }}
            >
              {hero.ctaSecondaryLabel}
            </Link>
          </div>
        </div>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', width: 420, height: 420, borderRadius: '50%', background: '#F4B03026' }} />
          <div style={{ position: 'relative', width: 340 }}>
            <MediaBlock media={hero.heroImage} alt="" radius={0} style={{ background: 'transparent' }} placeholderLabel="[ imagem de destaque ]" />
          </div>
        </div>
      </section>

      {/* PILARES */}
      <section className="container" style={{ padding: '0 32px 96px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, marginBottom: 36, flexWrap: 'wrap' }}>
          <h2 style={{ font: '700 32px var(--font-display)', margin: 0 }}>O que é o REJORC</h2>
          <Link to="/sobre" style={{ font: '800 15px var(--font-body)', color: 'var(--purple)', textDecoration: 'none' }}>
            Saiba mais →
          </Link>
        </div>
        <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
          {pillars.map((p, i) => (
            <div key={i} style={{ background: '#FFF', border: '1.5px solid #21181414', borderRadius: 20, padding: '32px 28px' }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: p.color, marginBottom: 20 }} />
              <h3 style={{ font: '700 21px var(--font-display)', margin: '0 0 10px' }}>{p.title}</h3>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: '#211814AA', margin: 0 }}>{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROJETO ATUAL */}
      <section style={{ background: 'var(--ink)', padding: '80px 32px' }}>
        <div className="container grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center', padding: 0 }}>
          <div>
            <div
              style={{
                display: 'inline-block',
                fontWeight: 800,
                fontSize: 13,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                background: '#F4B0301F',
                padding: '8px 16px',
                borderRadius: 999,
                marginBottom: 18,
              }}
            >
              {project.badge}
            </div>
            <h2 style={{ font: '700 32px var(--font-display)', color: '#F5F1EA', margin: '0 0 16px' }}>{project.title}</h2>
            <p style={{ fontSize: 16, lineHeight: 1.65, color: '#F5F1EAB3', margin: '0 0 28px' }}>{project.text}</p>
            <Link
              to="/atualizacoes"
              style={{ font: '700 16px var(--font-display)', color: '#211814', background: 'var(--gold)', padding: '14px 26px', borderRadius: 999, textDecoration: 'none' }}
            >
              {project.ctaLabel}
            </Link>
          </div>
          <MediaBlock media={project.image} alt="" style={{ height: 260 }} placeholderLabel="[ imagem: bastidores do projeto atual ]" />
        </div>
      </section>

      {/* MATERIAS DESTAQUE */}
      <section className="container" style={{ padding: '96px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, marginBottom: 36, flexWrap: 'wrap' }}>
          <h2 style={{ font: '700 32px var(--font-display)', margin: 0 }}>Matérias em destaque</h2>
          <Link to="/materias" style={{ font: '800 15px var(--font-body)', color: 'var(--purple)', textDecoration: 'none' }}>
            Ver todas →
          </Link>
        </div>
        <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, marginBottom: 20 }}>
          {materias.length === 0 && <div className="empty-state">Nenhuma matéria publicada ainda.</div>}
          {materias.map((m) => (
            <Link key={m.id} to="/materias" style={{ textDecoration: 'none', display: 'block', background: '#FFF', borderRadius: 20, overflow: 'hidden', border: '1.5px solid #21181414' }}>
              <MediaBlock media={m.image} alt={m.title} radius={0} style={{ height: 170 }} placeholderLabel="[ foto da matéria ]" />
              <div style={{ padding: 22 }}>
                <div style={{ fontWeight: 800, fontSize: 12.5, letterSpacing: '0.04em', textTransform: 'uppercase', color: m.color, marginBottom: 10 }}>{m.tag}</div>
                <h3 style={{ font: '700 19px/1.25 var(--font-display)', color: '#211814', margin: '0 0 8px' }}>{m.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.55, color: '#21181499', margin: 0 }}>{m.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
        <div style={{ background: '#516E900F', border: '1.5px dashed #516E9066', borderRadius: 16, padding: '22px 26px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
          <p style={{ fontSize: 15, color: '#211814CC', margin: 0 }}>
            Mais reportagens completas também no site do jornal <strong>Comunicação</strong>, parceiro do curso.
          </p>
          <a href="#" style={{ flex: 'none', font: '700 15px var(--font-display)', color: '#F5F1EA', background: 'var(--blue)', padding: '12px 22px', borderRadius: 999, textDecoration: 'none' }}>
            Visitar site do jornal ↗
          </a>
        </div>
      </section>

      {/* GALERIA */}
      <section className="container" style={{ padding: '0 32px 96px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, marginBottom: 36, flexWrap: 'wrap' }}>
          <h2 style={{ font: '700 32px var(--font-display)', margin: 0 }}>Coisas que já fizemos</h2>
          <Link to="/fotos" style={{ font: '800 15px var(--font-body)', color: 'var(--purple)', textDecoration: 'none' }}>
            Ver galeria completa →
          </Link>
        </div>
        <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gridTemplateRows: 'repeat(2,140px)', gap: 18 }}>
          {fotos.length === 0 && <div className="empty-state" style={{ gridColumn: 'span 4' }}>Nenhuma foto cadastrada ainda.</div>}
          {fotos.map((f, i) => (
            <MediaBlock
              key={f.id || i}
              media={f}
              alt={f.label}
              radius={18}
              style={i === 0 ? { gridColumn: 'span 2', gridRow: 'span 2' } : {}}
              placeholderLabel={f.label || '[ foto ]'}
            />
          ))}
        </div>
      </section>

      {/* NEWSLETTER CTA */}
      <section className="container" style={{ margin: '24px auto 96px', padding: '0 32px' }}>
        <div
          className="grid-2"
          style={{ background: 'var(--gold)', borderRadius: 28, padding: '56px 48px', display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 32, alignItems: 'center' }}
        >
          <div>
            <h2 style={{ font: '800 30px var(--font-display)', color: '#211814', margin: '0 0 12px' }}>{newsletterCta.title}</h2>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: '#211814CC', margin: 0 }}>{newsletterCta.text}</p>
          </div>
          <Link
            to="/contato"
            style={{ justifySelf: 'end', font: '700 16.5px var(--font-display)', color: '#F5F1EA', background: 'var(--ink)', padding: '16px 30px', borderRadius: 999, textDecoration: 'none', whiteSpace: 'nowrap' }}
          >
            Assinar agora
          </Link>
        </div>
      </section>
    </div>
  );
}
