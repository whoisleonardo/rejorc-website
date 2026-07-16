import { useSection } from '../hooks/useSection';
import { TextField, SaveBar } from '../components/Fields';
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
        <p>Galeria de registros do projeto. Aceita imagens, áudios (MP3, M4A, OGG, WAV) e vídeos do YouTube, TikTok e Reels do Instagram.</p>
      </div>

      {loading || !data ? (
        <div className="empty-state">Carregando…</div>
      ) : (
        <div className="admin-card">
          <RepeatList
            items={data.items}
            onChange={(items) => setData({ ...data, items })}
            itemLabel={(item, i) => item.label || `Item ${i + 1}`}
            addLabel="Adicionar foto ou vídeo"
            newItem={() => ({ id: newId(), type: 'image', url: '', label: '' })}
            renderItem={(item, i, update) => (
              <>
                <TextField label="Legenda" value={item.label} onChange={(v) => update({ label: v })} />
                <MediaPicker label="Foto ou vídeo" media={item} onChange={(m) => update(m)} />
              </>
            )}
          />
          <SaveBar saving={saving} saved={saved} error={error} onSave={() => save(data)} />
        </div>
      )}
    </div>
  );
}
