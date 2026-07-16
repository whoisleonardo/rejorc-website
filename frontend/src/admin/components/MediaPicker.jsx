import { useRef, useState } from 'react';
import { api, API_URL } from '../../api';
import { VIDEO_TYPES } from '../../utils/video';

function resolveUrl(url) {
  if (!url) return '';
  return url.startsWith('http') ? url : `${API_URL}${url}`;
}

export default function MediaPicker({ media, onChange, label = 'Imagem / vídeo' }) {
  const value = media || { type: 'image', url: '' };
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  function updateType(type) {
    onChange({ type, url: type === value.type ? value.url : '' });
  }
  function updateUrl(url) {
    onChange({ ...value, url });
  }

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const res = await api.uploadImage(file);
      onChange({ type: 'image', url: res.url });
    } catch (err) {
      setError(err.message || 'Falha ao enviar imagem.');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  return (
    <div className="field">
      <label>{label}</label>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
        {VIDEO_TYPES.map((t) => (
          <button
            type="button"
            key={t.value}
            onClick={() => updateType(t.value)}
            className={`btn btn-sm ${value.type === t.value ? 'btn-primary' : 'btn-outline'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="media-picker">
        <div className="media-preview">
          {value.url ? (
            value.type === 'image' ? (
              <img src={resolveUrl(value.url)} alt="" />
            ) : (
              'vídeo definido ✓'
            )
          ) : (
            'sem mídia'
          )}
        </div>

        <div style={{ flex: 1, minWidth: 220 }}>
          {value.type === 'image' ? (
            <>
              <input type="file" accept="image/*" ref={fileRef} onChange={handleFile} style={{ marginBottom: 8 }} />
              <input
                type="url"
                placeholder="ou cole a URL de uma imagem"
                value={value.url || ''}
                onChange={(e) => updateUrl(e.target.value)}
              />
              {uploading && <div style={{ fontSize: 13, color: '#21181499', marginTop: 6 }}>Enviando imagem…</div>}
            </>
          ) : (
            <input
              type="url"
              placeholder={
                value.type === 'youtube'
                  ? 'Cole o link do vídeo do YouTube'
                  : value.type === 'tiktok'
                  ? 'Cole o link do vídeo do TikTok'
                  : 'Cole o link do Reels do Instagram'
              }
              value={value.url}
              onChange={(e) => updateUrl(e.target.value)}
            />
          )}
          {error && <div style={{ fontSize: 13, color: '#C0392B', marginTop: 6 }}>{error}</div>}
        </div>
      </div>
    </div>
  );
}
