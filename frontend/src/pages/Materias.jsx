import { useMemo, useState } from 'react';
import { useContent } from '../content/ContentContext';
import MediaBlock from '../components/MediaBlock';
import MateriaModal from '../components/MateriaModal';

function hasBody(m) {
  return Boolean(m.body && m.body.replace(/<[^>]*>/g, '').trim());
}

const CATS = [
  ['todas', 'Todas'],
  ['reportagem', 'Reportagem'],
  ['entrevista', 'Entrevista'],
  ['opiniao', 'Opinião'],
  ['coluna', 'Coluna'],
];

export default function Materias() {
  const { content } = useContent();
  const section = content.materias || {};
  const all = section.items || [];
  const [filter, setFilter] = useState('todas');
  const [aberta, setAberta] = useState(null);

  const filtered = useMemo(() => {
    if (filter === 'todas') return all;
    return all.filter((m) => m.category === filter);
  }, [all, filter]);

  return (
    <div>
      <section className="container" style={{ padding: '36px 32px 32px' }}>
        <div style={{ display: 'inline-block', fontWeight: 800, fontSize: 13, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--purple)', background: '#573B6F1A', padding: '8px 16px', borderRadius: 999, marginBottom: 20 }}>
          {section.badge || 'Matérias'}
        </div>
        <h1 style={{ font: '800 44px var(--font-display)', margin: '0 0 16px' }}>{section.title}</h1>
        <p style={{ fontSize: 17, lineHeight: 1.6, color: '#211814B3', maxWidth: 640, margin: '0 0 28px' }}>
          {section.subtitle}
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {CATS.map(([key, label]) => {
            const active = key === filter;
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                style={{
                  fontWeight: 800,
                  fontSize: 13.5,
                  padding: '10px 18px',
                  borderRadius: 999,
                  border: `1.5px solid ${active ? '#211814' : '#21181433'}`,
                  background: active ? '#211814' : 'transparent',
                  color: active ? '#F5F1EA' : '#211814',
                  cursor: 'pointer',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </section>

      {section.bannerText && (
        <section className="container" style={{ padding: '32px 32px 24px' }}>
          <div style={{ background: '#516E900F', border: '1.5px dashed #516E9066', borderRadius: 16, padding: '22px 26px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
            <p style={{ fontSize: 15, color: '#211814CC', margin: 0 }}>{section.bannerText}</p>
            {section.bannerUrl && (
              <a href={section.bannerUrl} target="_blank" rel="noreferrer" style={{ flex: 'none', font: '700 15px var(--font-display)', color: '#F5F1EA', background: 'var(--blue)', padding: '12px 22px', borderRadius: 999, textDecoration: 'none' }}>
                {section.bannerButtonLabel || 'Visitar site ↗'}
              </a>
            )}
          </div>
        </section>
      )}

      <section className="container" style={{ padding: '24px 32px 100px' }}>
        <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 26 }}>
          {filtered.length === 0 && <div className="empty-state">Nenhuma matéria nessa categoria ainda.</div>}
          {filtered.map((m) => {
            const cardStyle = { textDecoration: 'none', display: 'block', width: '100%', textAlign: 'left', padding: 0, cursor: 'pointer', background: '#FFF', borderRadius: 20, overflow: 'hidden', border: '1.5px solid #21181414' };
            const inner = (
              <>
                <MediaBlock media={m.image} alt={m.title} radius={0} style={{ height: 170 }} placeholderLabel="[ foto da matéria ]" />
                <div style={{ padding: 22 }}>
                  <div style={{ fontWeight: 800, fontSize: 12.5, letterSpacing: '0.04em', textTransform: 'uppercase', color: m.color, marginBottom: 10 }}>{m.tag}</div>
                  <h3 style={{ font: '700 19px/1.25 var(--font-display)', color: '#211814', margin: '0 0 8px' }}>{m.title}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.55, color: '#21181499', margin: '0 0 12px' }}>{m.excerpt}</p>
                  <div style={{ fontSize: 13, color: '#21181480' }}>{m.date}</div>
                </div>
              </>
            );
            // Com texto completo cadastrado, o card abre a matéria num quadro;
            // sem texto mas com link externo, leva ao link; sem nenhum dos
            // dois, o card não é clicável (evita o pulo para o topo do "#").
            if (hasBody(m)) {
              return (
                <button key={m.id} type="button" onClick={() => setAberta(m)} style={{ ...cardStyle, font: 'inherit' }}>
                  {inner}
                </button>
              );
            }
            if (m.link) {
              return (
                <a key={m.id} href={m.link} target="_blank" rel="noreferrer" style={cardStyle}>
                  {inner}
                </a>
              );
            }
            return (
              <div key={m.id} style={{ ...cardStyle, cursor: 'default' }}>
                {inner}
              </div>
            );
          })}
        </div>
      </section>

      <MateriaModal materia={aberta} onClose={() => setAberta(null)} />
    </div>
  );
}
