# Envio de newsletter pelo painel — design

**Data:** 2026-07-13
**Objetivo:** permitir que a gestão escreva e dispare a newsletter para os
inscritos direto do painel, via Brevo (plano grátis: 300 e-mails/dia).

## Decisões

- **Serviço:** Brevo, pela API REST (`fetch` nativo, sem SDK). O remetente é
  o endereço verificado como *sender* no Brevo (`NEWSLETTER_FROM_EMAIL`),
  independente do e-mail da conta.
- **Editor:** rico (react-quill-new / Quill 2 — negrito, itálico, links,
  listas, títulos, imagens). Imagens **nunca** entram como base64 (Gmail
  bloqueia): o botão de imagem usa o upload existente e insere a URL.
  No envio usa-se `getSemanticHTML()` (listas viram `<ul>/<ol>` de verdade).
- **Sanitização no servidor:** `sanitize-html` com allowlist de tags antes
  de embrulhar no template — o HTML do editor nunca vai cru para o e-mail.
- **Template:** cabeçalho e cores do REJORC + rodapé com link único de
  descadastro por destinatário (`{{params.unsubscribeUrl}}` no Brevo, envio
  em lotes com `messageVersions`, até 500 por chamada).
- **Descadastro:** coluna `unsubscribe_token` por inscrito (migração
  automática com backfill). Link leva a página pública do site
  (`/newsletter/sair?token=…`) que chama `POST /api/newsletter/unsubscribe`
  (público, com rate limit).
- **Histórico:** tabela `newsletter_sends` (assunto, corpo, quem enviou,
  contagens ok/falha, teste ou real) listada na aba Enviar. Tudo auditado.
- **Sem chave configurada:** a aba Enviar mostra instruções de configuração
  em vez de quebrar.
- **Teste:** botão "Enviar teste para mim" manda só para a usuária logada.

## Rotas novas (`/api/newsletter`)

- `GET /send-config` (auth) — se o envio está configurado + limites.
- `POST /send-test` (auth) — envia o rascunho para o e-mail da usuária.
- `POST /send` (auth) — sanitiza, monta template, envia para todos, grava
  histórico, retorna `{ total, ok, fail }`.
- `GET /sends` (auth) — histórico de envios.
- `POST /unsubscribe` (público + rate limit) — remove inscrito por token.

## Variáveis de ambiente novas (backend)

- `BREVO_API_KEY` — chave da API do Brevo.
- `NEWSLETTER_FROM_EMAIL` / `NEWSLETTER_FROM_NAME` — remetente verificado.
- `API_PUBLIC_URL` — URL pública da API (imagens absolutas nos e-mails).
- (`BREVO_API_URL` — só para testes, aponta para um mock.)

## Frontend

- Página Newsletter com abas **Inscritos** (existente) e **Enviar**
  (assunto + editor + teste + envio com confirmação + histórico + aviso
  quando a lista passa de 300).
- Página pública `/newsletter/sair` confirmando o descadastro.
