import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '../api';
import { defaultContent } from './defaultContent';

const ContentContext = createContext(null);

export function ContentProvider({ children }) {
  const [content, setContent] = useState(defaultContent);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    api
      .getAllContent()
      .then((data) => {
        // mescla com o fallback para o caso de alguma secao nova ainda nao existir
        setContent({ ...defaultContent, ...data });
        setOffline(false);
      })
      .catch(() => {
        setOffline(true);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <ContentContext.Provider value={{ content, loading, offline, reload: load }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent deve ser usado dentro de <ContentProvider>');
  return ctx;
}
