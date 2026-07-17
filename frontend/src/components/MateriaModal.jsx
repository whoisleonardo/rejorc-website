import { useEffect } from 'react';
import MediaBlock from './MediaBlock';

/**
 * Quadro que abre por cima da página com a matéria completa. Fecha com o
 * botão ✕, clicando fora ou com a tecla Esc. O HTML do corpo já chega
 * sanitizado do servidor (utils/richText.js no backend).
 */
export default function MateriaModal({ materia, onClose }) {
  useEffect(() => {
    if (!materia) return undefined;
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [materia, onClose]);

  if (!materia) return null;

  return (
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={materia.title}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#211814CC',
        zIndex: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <article
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#F5F1EA',
          borderRadius: 20,
          maxWidth: 780,
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar matéria"
          style={{
            position: 'sticky',
            top: 14,
            marginLeft: 'calc(100% - 58px)',
            width: 44,
            height: 44,
            borderRadius: 999,
            border: 'none',
            background: '#211814',
            color: '#F5F1EA',
            fontSize: 18,
            cursor: 'pointer',
            zIndex: 2,
          }}
        >
          ✕
        </button>

        {materia.image?.url && (
          <div style={{ margin: '-58px 0 0' }}>
            <MediaBlock media={materia.image} alt={materia.title} radius={0} style={{ height: 300 }} />
          </div>
        )}

        <div style={{ padding: '26px 36px 44px' }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'baseline', flexWrap: 'wrap', marginBottom: 12 }}>
            <span style={{ fontWeight: 800, fontSize: 12.5, letterSpacing: '0.04em', textTransform: 'uppercase', color: materia.color || 'var(--purple)' }}>
              {materia.tag}
            </span>
            <span style={{ fontSize: 13.5, color: '#21181480' }}>{materia.date}</span>
          </div>
          <h2 style={{ font: '800 30px/1.2 var(--font-display)', margin: '0 0 18px' }}>{materia.title}</h2>
          <div className="article-body" dangerouslySetInnerHTML={{ __html: materia.body }} />
          {materia.link && (
            <a
              href={materia.link}
              target="_blank"
              rel="noreferrer"
              style={{ display: 'inline-block', marginTop: 22, font: '700 15px var(--font-display)', color: 'var(--purple)' }}
            >
              Ver matéria original ↗
            </a>
          )}
        </div>
      </article>
    </div>
  );
}
