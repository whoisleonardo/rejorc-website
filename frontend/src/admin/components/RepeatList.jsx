export default function RepeatList({ items, onChange, renderItem, newItem, addLabel = 'Adicionar item', itemLabel = (item, i) => `Item ${i + 1}` }) {
  const list = items || [];

  function update(index, patch) {
    const next = list.map((it, i) => (i === index ? { ...it, ...patch } : it));
    onChange(next);
  }
  function remove(index) {
    onChange(list.filter((_, i) => i !== index));
  }
  function add() {
    onChange([...list, newItem()]);
  }
  function move(index, dir) {
    const target = index + dir;
    if (target < 0 || target >= list.length) return;
    const next = [...list];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div>
      {list.map((item, i) => (
        <div className="repeat-item" key={i}>
          <div className="repeat-item-head">
            <span className="index">{itemLabel(item, i)}</span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button type="button" className="btn btn-sm btn-outline" onClick={() => move(i, -1)} disabled={i === 0} title="Mover para cima">↑</button>
              <button type="button" className="btn btn-sm btn-outline" onClick={() => move(i, 1)} disabled={i === list.length - 1} title="Mover para baixo">↓</button>
              <button type="button" className="btn btn-sm btn-danger" onClick={() => remove(i)}>Remover</button>
            </div>
          </div>
          {renderItem(item, i, (patch) => update(i, patch))}
        </div>
      ))}
      <button type="button" className="btn btn-outline" onClick={add}>
        + {addLabel}
      </button>
    </div>
  );
}
