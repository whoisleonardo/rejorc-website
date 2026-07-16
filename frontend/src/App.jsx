import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ContentProvider } from './content/ContentContext';

import Layout from './components/Layout';
import Home from './pages/Home';
import Sobre from './pages/Sobre';
import Materias from './pages/Materias';
import Fotos from './pages/Fotos';
import Atualizacoes from './pages/Atualizacoes';
import Contato from './pages/Contato';
import NewsletterSair from './pages/NewsletterSair';

import AcessoLogin from './admin/AcessoLogin';
import AdminLayout from './admin/AdminLayout';
import Overview from './admin/pages/Overview';
import ContentEditor from './admin/pages/ContentEditor';
import MateriasAdmin from './admin/pages/MateriasAdmin';
import FotosAdmin from './admin/pages/FotosAdmin';
import AtualizacoesAdmin from './admin/pages/AtualizacoesAdmin';
import NewsletterAdmin from './admin/pages/NewsletterAdmin';
import MensagensAdmin from './admin/pages/MensagensAdmin';
import UsuariosAdmin from './admin/pages/UsuariosAdmin';
import AuditoriaAdmin from './admin/pages/AuditoriaAdmin';

function PublicSite() {
  return (
    <ContentProvider>
      <Layout />
    </ContentProvider>
  );
}

function NotFound() {
  return (
    <div style={{ padding: '120px 32px', textAlign: 'center' }}>
      <h1 style={{ font: '800 32px var(--font-display)' }}>Página não encontrada</h1>
      <p>O endereço que você acessou não existe.</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<PublicSite />}>
            <Route index element={<Home />} />
            <Route path="sobre" element={<Sobre />} />
            <Route path="materias" element={<Materias />} />
            <Route path="fotos" element={<Fotos />} />
            <Route path="atualizacoes" element={<Atualizacoes />} />
            <Route path="contato" element={<Contato />} />
            <Route path="newsletter/sair" element={<NewsletterSair />} />
          </Route>

          <Route path="/acesso" element={<AcessoLogin />} />
          <Route path="/acesso/painel" element={<AdminLayout />}>
            <Route index element={<Overview />} />
            <Route path="conteudo" element={<ContentEditor />} />
            <Route path="materias" element={<MateriasAdmin />} />
            <Route path="fotos" element={<FotosAdmin />} />
            <Route path="atualizacoes" element={<AtualizacoesAdmin />} />
            <Route path="newsletter" element={<NewsletterAdmin />} />
            <Route path="mensagens" element={<MensagensAdmin />} />
            <Route path="usuarios" element={<UsuariosAdmin />} />
            <Route path="auditoria" element={<AuditoriaAdmin />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
