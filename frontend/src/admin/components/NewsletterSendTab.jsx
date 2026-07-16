import { useEffect, useMemo, useRef, useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { api, API_URL } from '../../api';

/**
 * Aba "Enviar" da newsletter: assunto + editor rico + teste + envio + histórico.
 * As imagens do editor sobem pelo upload do painel e entram como URL
 * (nunca base64 — o Gmail bloqueia imagens embutidas).
 */
export default function NewsletterSendTab() {
  const [config, setConfig] = useState(null);
  const [sends, setSends] = useState([]);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState('');
  const [feedback, setFeedback] = useState(null);
  const quillRef = useRef(null);

  function loadInfo() {
    api.getNewsletterSendConfig().then(setConfig).catch(() => setConfig({ configured: false }));
    api.listNewsletterSends().then((r) => setSends(r.sends)).catch(() => {});
  }

  useEffect(loadInfo, []);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          ['link', 'image'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['blockquote'],
          ['clean'],
        ],
        handlers: {
          image() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/png,image/jpeg,image/webp,image/gif';
            input.onchange = async () => {
              const file = input.files && input.files[0];
              if (!file) return;
              try {
                const { url } = await api.uploadImage(file);
                const quill = quillRef.current && quillRef.current.getEditor();
                if (!quill) return;
                const range = quill.getSelection(true);
                quill.insertEmbed(range ? range.index : 0, 'image', `${API_URL}${url}`);
              } catch (err) {
                setFeedback({ type: 'error', text: `Falha no upload da imagem: ${err.message}` });
              }
            };
            input.click();
          },
        },
      },
    }),
    []
  );

  function currentHtml() {
    const quill = quillRef.current && quillRef.current.getEditor();
    return quill ? quill.getSemanticHTML() : body;
  }

  async function handleTest() {
    setBusy('test');
    setFeedback(null);
    try {
      const res = await api.sendNewsletterTest(subject, currentHtml());
      setFeedback({ type: 'ok', text: `E-mail de teste enviado para ${res.to}. Confira sua caixa de entrada.` });
      loadInfo();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    } finally {
      setBusy('');
    }
  }

  async function handleSend() {
    const total = config?.totalSubscribers ?? 0;
    if (!confirm(`Enviar "${subject}" para todos os ${total} inscritos? Essa ação não pode ser desfeita.`)) return;
    setBusy('send');
    setFeedback(null);
    try {
      const res = await api.sendNewsletter(subject, currentHtml());
      if (res.fail) {
        setFeedback({ type: 'error', text: `Enviado para ${res.ok} de ${res.total} inscritos — ${res.fail} falharam. (${res.error || ''})` });
      } else {
        setFeedback({ type: 'ok', text: `Newsletter enviada para ${res.ok} inscrito(s)! 🎉` });
        setSubject('');
        setBody('');
      }
      loadInfo();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    } finally {
      setBusy('');
    }
  }

  if (config && !config.configured) {
    return (
      <div className="admin-card">
        <h2 style={{ marginTop: 0 }}>Envio ainda não configurado</h2>
        <p>Para enviar a newsletter direto do painel, é preciso conectar uma conta (gratuita) do Brevo:</p>
        <ol style={{ lineHeight: 1.9 }}>
          <li>Crie uma conta em <strong>brevo.com</strong> (plano grátis: 300 e-mails/dia).</li>
          <li>Em <em>Senders &amp; IPs</em>, cadastre e confirme o e-mail que aparecerá como remetente.</li>
          <li>Em <em>Settings → SMTP &amp; API → API Keys</em>, gere uma chave.</li>
          <li>No arquivo <code>backend/.env</code>, preencha <code>BREVO_API_KEY</code>, <code>NEWSLETTER_FROM_EMAIL</code> e <code>NEWSLETTER_FROM_NAME</code>, e reinicie a API.</li>
        </ol>
        <p>Enquanto isso, a lista de inscritos e o export em CSV continuam funcionando normalmente.</p>
      </div>
    );
  }

  const overLimit = config && config.totalSubscribers > config.dailyFreeLimit;

  return (
    <div>
      {feedback && (
        <div className={`alert ${feedback.type === 'ok' ? 'alert-success' : 'alert-error'}`}>{feedback.text}</div>
      )}
      {overLimit && (
        <div className="alert alert-error">
          Atenção: são {config.totalSubscribers} inscritos, e o plano grátis do Brevo envia até {config.dailyFreeLimit} e-mails
          por dia — parte dos envios pode falhar. Considere um plano pago ou dividir os envios.
        </div>
      )}

      <div className="admin-card" style={{ marginBottom: 24 }}>
        <label style={{ display: 'block', fontWeight: 700, marginBottom: 6 }}>Assunto</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Ex: Novidades do REJORC — edição de julho"
          maxLength={200}
          style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1.5px solid #21181426', marginBottom: 16 }}
        />

        <label style={{ display: 'block', fontWeight: 700, marginBottom: 6 }}>Conteúdo</label>
        <div style={{ background: '#fff', borderRadius: 10 }}>
          <ReactQuill ref={quillRef} theme="snow" value={body} onChange={setBody} modules={modules} />
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16 }}>
          <button type="button" className="btn btn-outline" onClick={handleTest} disabled={!!busy}>
            {busy === 'test' ? 'Enviando teste…' : '✉ Enviar teste para mim'}
          </button>
          <button type="button" className="btn btn-gold" onClick={handleSend} disabled={!!busy}>
            {busy === 'send'
              ? 'Enviando…'
              : `🚀 Enviar para todos (${config ? config.totalSubscribers : '…'} inscritos)`}
          </button>
        </div>
        {config && (
          <p style={{ fontSize: 13, opacity: 0.7, marginTop: 12, marginBottom: 0 }}>
            Remetente: {config.fromName} &lt;{config.fromEmail}&gt;. Todo e-mail sai com link de descadastro no rodapé.
          </p>
        )}
      </div>

      <div className="admin-card">
        <h2 style={{ marginTop: 0 }}>Histórico de envios</h2>
        {sends.length === 0 ? (
          <div className="empty-state">Nenhum envio ainda.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Assunto</th>
                <th>Enviado por</th>
                <th>Resultado</th>
                <th>Quando</th>
              </tr>
            </thead>
            <tbody>
              {sends.map((s) => (
                <tr key={s.id}>
                  <td>
                    {s.subject} {s.is_test ? <em style={{ opacity: 0.6 }}>(teste)</em> : null}
                  </td>
                  <td>{s.sent_by}</td>
                  <td>
                    {s.sent_ok}/{s.total} enviados{s.sent_fail ? ` — ${s.sent_fail} falharam` : ''}
                  </td>
                  <td>{s.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
