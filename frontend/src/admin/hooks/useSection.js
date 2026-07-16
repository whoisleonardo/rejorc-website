import { useCallback, useEffect, useState } from 'react';
import { api } from '../../api';

export function useSection(key) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const reload = useCallback(() => {
    setLoading(true);
    setError('');
    api
      .getSection(key)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [key]);

  useEffect(() => {
    reload();
  }, [reload]);

  async function save(nextData) {
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      await api.updateSection(key, nextData);
      setData(nextData);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.message || 'Não foi possível salvar.');
    } finally {
      setSaving(false);
    }
  }

  return { data, setData, loading, saving, error, saved, save, reload };
}
