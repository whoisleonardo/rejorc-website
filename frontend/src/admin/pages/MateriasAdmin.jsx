import { useSection } from '../hooks/useSection';
import { TextField, TextAreaField, ColorField, SaveBar } from '../components/Fields';
import MediaPicker from '../components/MediaPicker';
import RepeatList from '../components/RepeatList';

const CATEGORIAS = [
  ['reportagem', 'Reportagem'],
  ['entrevista', 'Entrevista'],
  ['opiniao', 'Opinião'],
  ['coluna', 'Coluna'],
];

function newId() {
  return `m_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export default function MateriasAdmin() {
  const { data, setData, loading, saving, saved, error, save } = useSection('materias');

  return (
    <div>
      <div className="admin-header">
        <h1>Matérias</h1>
        <p>Reportagens, entrevistas, colunas e opiniões que aparecem na página inicial e em "Matérias".</p>
      </div>

      {loading || !data ? (
        <div className="empty-state">Carregando…</div>
      ) : (
        <div className="admin-card">
          <RepeatList
            items={data.items}
            onChange={(items) => setData({ ...data, items })}
            itemLabel={(item, i) => item.title || `Matéria ${i + 1}`}
            addLabel="Adicionar matéria"
            newItem={() => ({
              id: newId(),
              tag: 'Reportagem',
              title: '',
              excerpt: '',
              color: '#573B6F',
              category: 'reportagem',
              date: '',
              image: { type: 'image', url: '' },
              link: '',
            })}
            renderItem={(item, i, update) => (
              <>
                <div className="field-row">
                  <TextField label="Título" value={item.title} onChange={(v) => update({ title: v })} />
                  <TextField label="Data (ex: Jun 2026)" value={item.date} onChange={(v) => update({ date: v })} />
                </div>
                <TextAreaField label="Resumo" rows={2} value={item.excerpt} onChange={(v) => update({ excerpt: v })} />
                <div className="field-row">
                  <TextField label="Etiqueta (ex: Reportagem)" value={item.tag} onChange={(v) => update({ tag: v })} />
                  <div className="field">
                    <label>Categoria (para o filtro)</label>
                    <select value={item.category} onChange={(e) => update({ category: e.target.value })}>
                      {CATEGORIAS.map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="field-row">
                  <ColorField label="Cor da etiqueta" value={item.color} onChange={(v) => update({ color: v })} />
                  <TextField label="Link externo (opcional)" placeholder="https://..." value={item.link} onChange={(v) => update({ link: v })} />
                </div>
                <MediaPicker label="Imagem/vídeo da matéria" media={item.image} onChange={(m) => update({ image: m })} />
              </>
            )}
          />
          <SaveBar saving={saving} saved={saved} error={error} onSave={() => save(data)} />
        </div>
      )}
    </div>
  );
}
