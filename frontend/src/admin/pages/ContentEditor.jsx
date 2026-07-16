import { useState } from 'react';
import { useSection } from '../hooks/useSection';
import { TextField, TextAreaField, ColorField, SaveBar } from '../components/Fields';
import MediaPicker from '../components/MediaPicker';
import RepeatList from '../components/RepeatList';

const TABS = [
  { key: 'site', label: 'Identidade' },
  { key: 'home', label: 'Página inicial' },
  { key: 'sobre', label: 'Sobre' },
  { key: 'contato', label: 'Contato' },
  { key: 'footer', label: 'Rodapé' },
];

export default function ContentEditor() {
  const [tab, setTab] = useState('site');

  return (
    <div>
      <div className="admin-header">
        <h1>Conteúdo do site</h1>
        <p>Edite os textos, imagens e vídeos que aparecem nas páginas públicas.</p>
      </div>

      <div className="tabs">
        {TABS.map((t) => (
          <button key={t.key} className={tab === t.key ? 'active' : ''} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'site' && <SiteTab />}
      {tab === 'home' && <HomeTab />}
      {tab === 'sobre' && <SobreTab />}
      {tab === 'contato' && <ContatoTab />}
      {tab === 'footer' && <FooterTab />}
    </div>
  );
}

function SiteTab() {
  const { data, setData, loading, saving, saved, error, save } = useSection('site');
  if (loading || !data) return <div className="empty-state">Carregando…</div>;

  return (
    <div className="admin-card">
      <h2>Identidade do site</h2>
      <p className="hint">Nome, logotipos e assinatura usados no cabeçalho e rodapé.</p>
      <TextField label="Nome do site" value={data.siteName} onChange={(v) => setData({ ...data, siteName: v })} />
      <TextField label="Assinatura (ex: Rede de Jornalismo para a Cidadania)" value={data.tagline} onChange={(v) => setData({ ...data, tagline: v })} />
      <MediaPicker label="Logotipo do cabeçalho" media={data.logoHeader} onChange={(m) => setData({ ...data, logoHeader: m })} />
      <MediaPicker label="Logotipo do rodapé" media={data.logoFooter} onChange={(m) => setData({ ...data, logoFooter: m })} />
      <SaveBar saving={saving} saved={saved} error={error} onSave={() => save(data)} />
    </div>
  );
}

function HomeTab() {
  const hero = useSection('home_hero');
  const pillars = useSection('pillars');
  const project = useSection('current_project');
  const newsletterCta = useSection('newsletter_cta');

  return (
    <div>
      <div className="admin-card">
        <h2>Topo (hero)</h2>
        <p className="hint">Primeira coisa que a pessoa vê ao abrir o site.</p>
        {hero.data && (
          <>
            <TextField label="Selo/etiqueta" value={hero.data.badge} onChange={(v) => hero.setData({ ...hero.data, badge: v })} />
            <TextField label="Título" value={hero.data.title} onChange={(v) => hero.setData({ ...hero.data, title: v })} />
            <TextAreaField label="Subtítulo" value={hero.data.subtitle} onChange={(v) => hero.setData({ ...hero.data, subtitle: v })} />
            <div className="field-row">
              <TextField label="Texto do botão principal" value={hero.data.ctaPrimaryLabel} onChange={(v) => hero.setData({ ...hero.data, ctaPrimaryLabel: v })} />
              <TextField label="Texto do botão secundário" value={hero.data.ctaSecondaryLabel} onChange={(v) => hero.setData({ ...hero.data, ctaSecondaryLabel: v })} />
            </div>
            <MediaPicker label="Imagem/vídeo de destaque" media={hero.data.heroImage} onChange={(m) => hero.setData({ ...hero.data, heroImage: m })} />
            <SaveBar saving={hero.saving} saved={hero.saved} error={hero.error} onSave={() => hero.save(hero.data)} />
          </>
        )}
      </div>

      <div className="admin-card">
        <h2>Pilares ("O que é o REJORC")</h2>
        <p className="hint">Os três cartões que explicam o projeto.</p>
        {pillars.data && (
          <>
            <RepeatList
              items={pillars.data.items}
              onChange={(items) => pillars.setData({ ...pillars.data, items })}
              newItem={() => ({ title: '', text: '', color: '#573B6F' })}
              itemLabel={(item, i) => item.title || `Pilar ${i + 1}`}
              addLabel="Adicionar pilar"
              renderItem={(item, i, update) => (
                <>
                  <TextField label="Título" value={item.title} onChange={(v) => update({ title: v })} />
                  <TextAreaField label="Texto" rows={2} value={item.text} onChange={(v) => update({ text: v })} />
                  <ColorField label="Cor" value={item.color} onChange={(v) => update({ color: v })} />
                </>
              )}
            />
            <SaveBar saving={pillars.saving} saved={pillars.saved} error={pillars.error} onSave={() => pillars.save(pillars.data)} />
          </>
        )}
      </div>

      <div className="admin-card">
        <h2>Banner "projeto atual"</h2>
        <p className="hint">Faixa escura que aparece no meio da página inicial.</p>
        {project.data && (
          <>
            <TextField label="Selo/etiqueta" value={project.data.badge} onChange={(v) => project.setData({ ...project.data, badge: v })} />
            <TextField label="Título" value={project.data.title} onChange={(v) => project.setData({ ...project.data, title: v })} />
            <TextAreaField label="Texto" value={project.data.text} onChange={(v) => project.setData({ ...project.data, text: v })} />
            <TextField label="Texto do botão" value={project.data.ctaLabel} onChange={(v) => project.setData({ ...project.data, ctaLabel: v })} />
            <MediaPicker label="Imagem/vídeo" media={project.data.image} onChange={(m) => project.setData({ ...project.data, image: m })} />
            <SaveBar saving={project.saving} saved={project.saved} error={project.error} onSave={() => project.save(project.data)} />
          </>
        )}
      </div>

      <div className="admin-card">
        <h2>Chamada da newsletter</h2>
        <p className="hint">Texto da faixa amarela de assinatura (aparece em várias páginas).</p>
        {newsletterCta.data && (
          <>
            <TextField label="Título" value={newsletterCta.data.title} onChange={(v) => newsletterCta.setData({ ...newsletterCta.data, title: v })} />
            <TextAreaField label="Texto" rows={2} value={newsletterCta.data.text} onChange={(v) => newsletterCta.setData({ ...newsletterCta.data, text: v })} />
            <SaveBar saving={newsletterCta.saving} saved={newsletterCta.saved} error={newsletterCta.error} onSave={() => newsletterCta.save(newsletterCta.data)} />
          </>
        )}
      </div>
    </div>
  );
}

function SobreTab() {
  const { data, setData, loading, saving, saved, error, save } = useSection('sobre');
  if (loading || !data) return <div className="empty-state">Carregando…</div>;

  return (
    <div>
      <div className="admin-card">
        <h2>Introdução</h2>
        <TextField label="Selo/etiqueta" value={data.badge} onChange={(v) => setData({ ...data, badge: v })} />
        <TextField label="Título" value={data.title} onChange={(v) => setData({ ...data, title: v })} />
        <TextAreaField label="Texto" value={data.text} onChange={(v) => setData({ ...data, text: v })} />
        <MediaPicker label="Imagem/vídeo" media={data.image} onChange={(m) => setData({ ...data, image: m })} />
      </div>

      <div className="admin-card">
        <h2>Números (estatísticas)</h2>
        <RepeatList
          items={data.stats}
          onChange={(stats) => setData({ ...data, stats })}
          newItem={() => ({ value: '', label: '', color: '#573B6F' })}
          itemLabel={(item, i) => item.label || `Número ${i + 1}`}
          addLabel="Adicionar número"
          renderItem={(item, i, update) => (
            <>
              <div className="field-row">
                <TextField label="Valor (ex: +40)" value={item.value} onChange={(v) => update({ value: v })} />
                <TextField label="Legenda" value={item.label} onChange={(v) => update({ label: v })} />
              </div>
              <ColorField label="Cor" value={item.color} onChange={(v) => update({ color: v })} />
            </>
          )}
        />
      </div>

      <div className="admin-card">
        <h2>Nossa missão</h2>
        <RepeatList
          items={data.missao}
          onChange={(missao) => setData({ ...data, missao })}
          newItem={() => ({ title: '', text: '', color: '#573B6F' })}
          itemLabel={(item, i) => item.title || `Item ${i + 1}`}
          addLabel="Adicionar item da missão"
          renderItem={(item, i, update) => (
            <>
              <TextField label="Título" value={item.title} onChange={(v) => update({ title: v })} />
              <TextAreaField label="Texto" rows={2} value={item.text} onChange={(v) => update({ text: v })} />
              <ColorField label="Cor" value={item.color} onChange={(v) => update({ color: v })} />
            </>
          )}
        />
      </div>

      <div className="admin-card">
        <h2>Como funciona (passos)</h2>
        <RepeatList
          items={data.passos}
          onChange={(passos) => setData({ ...data, passos })}
          newItem={() => ({ n: String((data.passos?.length || 0) + 1), title: '', text: '', color: '#573B6F' })}
          itemLabel={(item, i) => item.title || `Passo ${i + 1}`}
          addLabel="Adicionar passo"
          renderItem={(item, i, update) => (
            <>
              <div className="field-row">
                <TextField label="Número" value={item.n} onChange={(v) => update({ n: v })} />
                <TextField label="Título" value={item.title} onChange={(v) => update({ title: v })} />
              </div>
              <TextAreaField label="Texto" rows={2} value={item.text} onChange={(v) => update({ text: v })} />
              <ColorField label="Cor" value={item.color} onChange={(v) => update({ color: v })} />
            </>
          )}
        />
      </div>

      <div className="admin-card">
        <h2>Chamada final ("Quer fazer parte?")</h2>
        <TextField label="Título" value={data.ctaTitle} onChange={(v) => setData({ ...data, ctaTitle: v })} />
        <TextAreaField label="Texto" rows={2} value={data.ctaText} onChange={(v) => setData({ ...data, ctaText: v })} />
        <TextField label="Texto do botão" value={data.ctaButtonLabel} onChange={(v) => setData({ ...data, ctaButtonLabel: v })} />
      </div>

      <SaveBar saving={saving} saved={saved} error={error} onSave={() => save(data)} />
    </div>
  );
}

function ContatoTab() {
  const { data, setData, loading, saving, saved, error, save } = useSection('contato');
  if (loading || !data) return <div className="empty-state">Carregando…</div>;

  return (
    <div className="admin-card">
      <h2>Página de contato</h2>
      <TextField label="Selo/etiqueta" value={data.badge} onChange={(v) => setData({ ...data, badge: v })} />
      <TextField label="Título" value={data.title} onChange={(v) => setData({ ...data, title: v })} />
      <TextAreaField label="Subtítulo" rows={2} value={data.subtitle} onChange={(v) => setData({ ...data, subtitle: v })} />
      <TextAreaField label="Endereço" rows={3} value={data.address} onChange={(v) => setData({ ...data, address: v })} />
      <div className="field-row">
        <TextField label="E-mail de contato" value={data.email} onChange={(v) => setData({ ...data, email: v })} />
        <TextField label="Instagram" value={data.instagram} onChange={(v) => setData({ ...data, instagram: v })} />
      </div>
      <TextField label="WhatsApp (opcional)" value={data.whatsapp} onChange={(v) => setData({ ...data, whatsapp: v })} />
      <SaveBar saving={saving} saved={saved} error={error} onSave={() => save(data)} />
    </div>
  );
}

function FooterTab() {
  const { data, setData, loading, saving, saved, error, save } = useSection('footer');
  if (loading || !data) return <div className="empty-state">Carregando…</div>;

  return (
    <div className="admin-card">
      <h2>Rodapé</h2>
      <TextAreaField label="Descrição curta" rows={3} value={data.description} onChange={(v) => setData({ ...data, description: v })} />
      <h3 style={{ font: '700 15px var(--font-display)', marginTop: 20 }}>Redes sociais</h3>
      <RepeatList
        items={data.socials}
        onChange={(socials) => setData({ ...data, socials })}
        newItem={() => ({ name: '', href: '' })}
        itemLabel={(item, i) => item.name || `Rede ${i + 1}`}
        addLabel="Adicionar rede social"
        renderItem={(item, i, update) => (
          <div className="field-row">
            <TextField label="Nome (Instagram, E-mail, WhatsApp…)" value={item.name} onChange={(v) => update({ name: v })} />
            <TextField label="Link" value={item.href} onChange={(v) => update({ href: v })} />
          </div>
        )}
      />
      <SaveBar saving={saving} saved={saved} error={error} onSave={() => save(data)} />
    </div>
  );
}
