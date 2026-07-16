import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useContent } from '../content/ContentContext';

export default function Layout() {
  const { loading } = useContent();

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100%' }}>
      <Header />
      {loading ? (
        <div style={{ padding: '120px 32px', textAlign: 'center', color: '#21181480' }}>Carregando…</div>
      ) : (
        <Outlet />
      )}
      <Footer />
    </div>
  );
}
