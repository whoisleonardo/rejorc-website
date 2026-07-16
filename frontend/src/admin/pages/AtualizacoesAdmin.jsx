import { useSection } from '../hooks/useSection';
import { TextField, TextAreaField, ColorField, SaveBar } from '../components/Fields';
import MediaPicker from '../components/MediaPicker';
import RepeatList from '../components/RepeatList';

export default function AtualizacoesAdmin() {
  const { data, setData, loading, saving, saved, error, save } = useSection('atualizacoes');

  return (
    <div>
      <div className="admin-header">
        <h1>Atualizações</h1>
        <p>Linha do tempo do projeto em andamento.</p>
      </div>

      {loading || !data ? (
        <div className="empty-state">Carregando…</div>
      ) : (
        <>
          <div className="admin-card">
            <h2>Cabeçalho da página</h2>
            <TextField label="Selo/etiqueta" value={data.badge} onChange={(v) => setData({ ...data, badge: v })} />
            <TextField label="Título" value={data.title} onChange={(v) => setData({ ...data, title: v })} />
            <TextAreaField label="Subtítulo" rows={2} value={data.subtitle} onChange={(v) => setData({ ...data, subtitle: v })} />
            <MediaPicker label="Imagem/vídeo de capa" media={data.coverImage} onChange={(m) => setData({ ...data, coverImage: m })} />
          </div>

          <div className="admin-card">
            <h2>Linha do tempo</h2>
            <RepeatList
              items={data.items}
              onChange={(items) => setData({ ...data, items })}
              itemLabel={(item, i) => item.title || `Atualização ${i + 1}`}
              addLabel="Adicionar atualização"
              newItem={() => ({ date: '', title: '', text: '', color: '#573B6F' })}
              renderItem={(item, i, update) => (
                <>
                  <div className="field-row">
                    <TextField label="Data (ex: Jun 2026)" value={item.date} onChange={(v) => update({ date: v })} />
                    <ColorField label="Cor" value={item.color} onChange={(v) => update({ color: v })} />
                  </div>
                  <TextField label="Título" value={item.title} onChange={(v) => update({ title: v })} />
                  <TextAreaField label="Texto" rows={2} value={item.text} onChange={(v) => update({ text: v })} />
                </>
              )}
            />
          </div>

          <SaveBar saving={saving} saved={saved} error={error} onSave={() => save(data)} />
        </>
      )}
    </div>
  );
}
