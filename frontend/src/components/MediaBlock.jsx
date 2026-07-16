import { getEmbedInfo } from '../utils/video';
import { API_URL } from '../api';

function resolveUrl(url) {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${API_URL}${url}`;
}

/**
 * Renderiza uma imagem, um video incorporado (YouTube/TikTok/Instagram) ou um
 * placeholder tracejado quando ainda nao ha midia cadastrada.
 *
 * media: { type: 'image'|'youtube'|'tiktok'|'instagram', url: string }
 */
export default function MediaBlock({ media, alt = '', style, radius = 16, placeholderLabel = '[ imagem ]' }) {
  const type = media?.type || 'image';
  const url = media?.url;

  const boxStyle = { borderRadius: radius, overflow: 'hidden', ...style };

  if (!url) {
    return <div className="ph" style={boxStyle}>{placeholderLabel}</div>;
  }

  if (type === 'image') {
    return (
      <div style={boxStyle}>
        <img src={resolveUrl(url)} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
    );
  }

  // video (youtube / tiktok / instagram)
  const embed = getEmbedInfo(url);
  if (!embed) {
    return (
      <div className="ph" style={boxStyle}>
        Link de vídeo não reconhecido
      </div>
    );
  }

  return (
    <div style={{ ...boxStyle, position: 'relative', background: '#000' }}>
      <iframe
        src={embed.embedUrl}
        title={alt || 'Vídeo'}
        style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
