import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api';

/**
 * Página pública aberta pelo link "não quero mais receber" dos e-mails da
 * newsletter. Pede confirmação antes de remover, para que clientes de e-mail
 * que pré-carregam links não descadastrem ninguém sem querer.
 */
export default function NewsletterSair() {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const [status, setStatus] = useState('idle'); // idle | busy | done | error
  const [message, setMessage] = useState('');

  async function handleUnsubscribe() {
    setStatus('busy');
    try {
      await api.unsubscribeNewsletter(token);
      setStatus('done');
    } catch (err) {
      setStatus('error');
      setMessage(err.message);
    }
  }

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '96px 24px', textAlign: 'center' }}>
      <h1 style={{ font: '800 28px var(--font-display)', marginBottom: 12 }}>Sair da newsletter</h1>

      {!token ? (
        <p>Este link de descadastro está incompleto. Abra o link exatamente como veio no e-mail.</p>
      ) : status === 'done' ? (
        <>
          <p>Pronto! Você não vai mais receber a newsletter do REJORC.</p>
          <p>Mudou de ideia? É só se inscrever de novo pelo rodapé do site.</p>
          <Link className="btn btn-gold" to="/">Voltar para o site</Link>
        </>
      ) : status === 'error' ? (
        <p>{message || 'Não foi possível processar o descadastro. Tente abrir o link do e-mail novamente.'}</p>
      ) : (
        <>
          <p>Você quer parar de receber os e-mails da newsletter do REJORC?</p>
          <button type="button" className="btn btn-gold" onClick={handleUnsubscribe} disabled={status === 'busy'}>
            {status === 'busy' ? 'Removendo…' : 'Sim, quero sair da lista'}
          </button>
        </>
      )}
    </div>
  );
}
