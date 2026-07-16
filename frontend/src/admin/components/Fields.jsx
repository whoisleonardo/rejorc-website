export function TextField({ label, value, onChange, placeholder }) {
  return (
    <div className="field">
      <label>{label}</label>
      <input type="text" value={value || ''} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

export function TextAreaField({ label, value, onChange, rows = 4, placeholder }) {
  return (
    <div className="field">
      <label>{label}</label>
      <textarea rows={rows} value={value || ''} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

export function ColorField({ label, value, onChange }) {
  return (
    <div className="field">
      <label>{label}</label>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <input type="color" value={value || '#573B6F'} onChange={(e) => onChange(e.target.value)} />
        <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} style={{ maxWidth: 120 }} />
      </div>
    </div>
  );
}

export function SaveBar({ saving, saved, error, onSave, label = 'Salvar alterações' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 8 }}>
      <button type="button" className="btn btn-primary" onClick={onSave} disabled={saving}>
        {saving ? 'Salvando…' : label}
      </button>
      {saved && <span style={{ color: 'var(--green)', fontWeight: 700, fontSize: 14 }}>✓ Salvo</span>}
      {error && <span style={{ color: '#C0392B', fontWeight: 600, fontSize: 14 }}>{error}</span>}
    </div>
  );
}
