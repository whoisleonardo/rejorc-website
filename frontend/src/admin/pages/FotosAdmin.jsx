import { useSection } from '../hooks/useSection';
import { TextField, TextAreaField, SaveBar } from '../components/Fields';
import MediaPicker from '../components/MediaPicker';
import RepeatList from '../components/RepeatList';

function newId() {
  return `f_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export default function FotosAdmin() {
  const { data, setData, loading, saving, saved, error, save } = useSection('fotos');

  return (
    <div>
      <div className="admin-header">
        <h1>Mídias</h1>
        <p>Galeria de registros do projeto. Aceita imagens, áudios (MP3, M4A, OGG, WAV), Spotify e vídeos do TikTok e Reels do Instagram.</p>
      </div>

      {loading || !data ? (
        <div className="empty-state">Carregando…</div>
      ) : (
        <div className="admin-card">
          <h2 style={{ marginTop: 0 }}>Topo da página "Mídias"</h2>
          <div className="field-row">
            <TextField label="Selo (etiqueta pequena)" value={data.badge || ''} onChange={(v) => setData({ ...data, badge: v })} />
            <TextField label="Título da página" value={data.title || ''} onChange={(v) => setData({ ...data, title: v })} />
          </div>
          <TextAreaField label="Subtítulo" rows={2} value={data.subtitle || ''} onChange={(v) => setData({ ...data, subtitle: v })} />

          <h2>Chamada do fim da página (caixa escura)</h2>
          <TextField
            label="Título da chamada (deixe vazio para esconder a caixa)"
            value={data.ctaTitle || ''}
            onChange={(v) => setData({ ...data, ctaTitle: v })}
          />
          <div className="field-row">
            <TextField label="Texto da chamada" value={data.ctaText || ''} onChange={(v) => setData({ ...data, ctaText: v })} />
            <TextField label="Texto do botão" value={data.ctaButtonLabel || ''} onChange={(v) => setData({ ...data, ctaButtonLabel: v })} />
          </div>

          <h2>Itens da galeria</h2>
          <RepeatList
            items={data.items}
            onChange={(items) => setData({ ...data, items })}
            itemLabel={(item, i) => item.label || `Item ${i + 1}`}
            addLabel="Adicionar mídia"
            newItem={() => ({ id: newId(), type: 'image', url: '', label: '' })}
            renderItem={(item, i, update) => (
              <>
                <TextField label="Legenda" value={item.label} onChange={(v) => update({ label: v })} />
                <MediaPicker label="Mídia (imagem, áudio, Spotify ou vídeo)" media={item} onChange={(m) => update(m)} />
              </>
            )}
          />
          <SaveBar saving={saving} saved={saved} error={error} onSave={() => save(data)} />
        </div>
      )}
    </div>
  );
}
