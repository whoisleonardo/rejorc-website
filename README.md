# REJORC — site + painel de gestão

Este projeto é a versão em React do site do REJORC (Rede de Jornalismo para a
Cidadania, projeto de extensão da UFPR), com um backend próprio que permite à
gestora controlar **todo** o conteúdo do site (textos, imagens e vídeos —
incluindo Reels do Instagram, TikTok e YouTube), gerenciar os e-mails
inscritos na newsletter, cadastrar/remover usuárias do painel e consultar um
log de auditoria de tudo que foi alterado.

## Estrutura do projeto

```
rejorc-app/
├── backend/     API em Node.js + Express + SQLite
└── frontend/    Site + painel em React (Vite)
```

- **Site público**: `/`, `/sobre`, `/materias`, `/fotos`, `/atualizacoes`, `/contato`
- **Painel da gestão**: `/acesso` (login) → `/acesso/painel` (dashboard)

Todo o conteúdo do site público vem da API — ou seja, tudo que a gestora
edita no painel aparece automaticamente no site, sem precisar mexer em
código.

## O que o painel (`/acesso`) permite fazer

- **Conteúdo do site**: editar textos, cores e imagens/vídeos de cada seção
  (identidade do site, página inicial, sobre, contato, rodapé).
- **Matérias**: adicionar, editar, reordenar e remover reportagens/entrevistas/
  colunas, cada uma com sua imagem ou vídeo.
- **Fotos & vídeos**: galeria de registros do projeto — aceita imagens ou
  vídeos incorporados do **YouTube**, **TikTok** e **Reels do Instagram**
  (basta colar o link).
- **Atualizações**: linha do tempo do projeto em andamento.
- **Newsletter**: ver todos os e-mails inscritos, buscar, remover e exportar
  a lista em CSV — e **escrever e enviar a newsletter** para a lista direto
  do painel (editor com negrito, links e imagens, botão de teste, histórico
  de envios e link de descadastro automático em cada e-mail).
- **Mensagens de contato**: ver, marcar como lida e apagar as mensagens
  enviadas pelo formulário de contato do site.
- **Usuários**: criar e remover contas de acesso ao painel, com dois papéis
  — *administradora* (acesso total, incluindo gerenciar usuárias) e
  *editora* (edita conteúdo, mas não mexe em usuárias).
- **Auditoria**: histórico de quem fez o quê e quando (logins, criações,
  edições, remoções e exportações).

## Jeito mais fácil: rodar com Docker

Se você tem o [Docker](https://www.docker.com/products/docker-desktop/)
instalado, não precisa instalar Node.js nem configurar nada. Na raiz do
projeto, rode:

```bash
docker compose up
```

Na primeira vez ele baixa e instala tudo (leva alguns minutos). Depois:

- Site: `http://localhost:5173`
- Painel: `http://localhost:5173/acesso` — login padrão
  `admin@rejorc.ufpr.br` / `troque-esta-senha-123`
- API: `http://localhost:4000`

Na primeira subida é criado o arquivo `backend/.env` (copiado do
`.env.example`) — edite-o para trocar a senha da admin e o `JWT_SECRET`.
O banco (`backend/data.sqlite`) e as imagens enviadas (`backend/uploads/`)
continuam ficando no seu disco, então o backup funciona igual.

Comandos úteis:

```bash
docker compose up -d      # roda em segundo plano
docker compose logs -f    # acompanha os logs
docker compose down       # para tudo (os dados ficam guardados)
```

Editar o código com os containers rodando funciona normalmente: a API e o
site recarregam sozinhos.

Se preferir rodar sem Docker, siga os passos abaixo.

## Pré-requisitos (sem Docker)

- [Node.js](https://nodejs.org) versão 18 ou mais recente
- npm (já vem junto com o Node.js)

## 1. Configurar o backend (API)

```bash
cd backend
cp .env.example .env
```

Abra o arquivo `.env` e ajuste:

- `JWT_SECRET`: troque por um valor longo e aleatório (ex: rode
  `openssl rand -hex 32` e cole o resultado).
- `ADMIN_EMAIL` e `ADMIN_PASSWORD`: e-mail e senha da primeira conta de
  administradora. **Troque a senha padrão antes de usar em produção.**
- `FRONTEND_URL`: endereço onde o site vai rodar (em desenvolvimento,
  `http://localhost:5173`, que já é o padrão).

Instale as dependências, crie o banco de dados e a primeira usuária
administradora, e inicie o servidor:

```bash
npm install
npm run seed   # cria o usuário admin e o conteúdo inicial do site
npm run dev    # inicia a API em http://localhost:4000
```

A API guarda tudo em um arquivo `backend/data.sqlite` (criado automaticamente)
e as imagens enviadas pela gestora em `backend/uploads/`. Para fazer backup
do site, basta guardar esses dois itens.

## 2. Configurar o frontend (site + painel)

Em outro terminal:

```bash
cd frontend
cp .env.example .env   # se for usar uma API em outro endereço, ajuste VITE_API_URL aqui
npm install
npm run dev
```

O site abre em `http://localhost:5173`. O painel de gestão fica em
`http://localhost:5173/acesso` — entre com o e-mail/senha definidos no
`.env` do backend.

## Como colocar um vídeo do Instagram/TikTok/YouTube

No painel, sempre que houver um campo de imagem (matérias, galeria de fotos,
banners, etc.), há botões para escolher entre **Imagem**, **YouTube**,
**TikTok** ou **Reels do Instagram**. Ao escolher um dos vídeos, basta colar
o link normal do vídeo, por exemplo:

- YouTube: `https://www.youtube.com/watch?v=XXXXXXXXXXX` ou um link de Shorts
- TikTok: `https://www.tiktok.com/@usuario/video/1234567890123456789`
- Instagram: `https://www.instagram.com/reel/XXXXXXXXXXX/`

O site incorpora o vídeo automaticamente no lugar da imagem.

## Envio de newsletter (Brevo)

O disparo dos e-mails usa o [Brevo](https://www.brevo.com) (plano grátis:
300 e-mails/dia). Sem configurar, o painel continua funcionando — só a aba
**Enviar newsletter** fica desativada, com instruções. Para ativar:

1. Crie uma conta no Brevo (pode ser com qualquer e-mail).
2. Em **Senders & IPs**, cadastre o e-mail que aparecerá como remetente
   (ex: o Gmail do projeto) e confirme pelo link que chega nele. O remetente
   **não precisa** ser o e-mail da conta.
3. Em **Settings → SMTP & API → API Keys**, gere uma chave.
4. No `backend/.env`, preencha `BREVO_API_KEY`, `NEWSLETTER_FROM_EMAIL`
   (o remetente verificado) e `NEWSLETTER_FROM_NAME`, e reinicie a API.
5. Em produção, preencha também `API_PUBLIC_URL` com a URL pública do
   backend — é ela que faz as imagens aparecerem nos e-mails.

No painel, use **"Enviar teste para mim"** antes de disparar para a lista:
o e-mail chega só para você, do jeito que os inscritos vão receber.

## Colocando o site no ar (produção)

**Caminho recomendado (gratuito):** siga o guia completo em
[`docs/DEPLOY.md`](docs/DEPLOY.md) — servidor gratuito da Oracle Cloud +
subdomínio DuckDNS + `docker-compose.prod.yml` (que já cuida do site
compilado, do HTTPS automático e do volume de dados). Em resumo, no
servidor:

```bash
echo "DOMAIN=seusite.duckdns.org" > .env
cp backend/.env.example backend/.env   # e preencha os valores de producao
docker compose -f docker-compose.prod.yml up -d --build
```

Alternativa sem Docker: suba `backend/` em um serviço com disco persistente
(Railway, Render pago, VPS) e publique o build do `frontend/` (`npm run
build`) em Vercel/Netlify/Cloudflare Pages com `VITE_API_URL` apontando
para a URL pública do backend — nesse caso ajuste também `FRONTEND_URL` e
`API_PUBLIC_URL` no backend.

## Segurança — checklist antes de ir ao ar

- [ ] Trocar `JWT_SECRET` por um valor aleatório novo
- [ ] Trocar a senha da conta administradora padrão
- [ ] Servir tudo em HTTPS
- [ ] Fazer backup periódico de `backend/data.sqlite` e `backend/uploads/`
- [ ] Revisar a lista de usuárias com acesso ao painel de vez em quando
      (aba **Usuários**, dentro do painel)

## Papéis de usuária

- **Administradora**: acesso total, incluindo criar/remover outras usuárias.
  Sempre precisa existir pelo menos uma administradora — o sistema impede
  que a última seja removida.
- **Editora**: pode editar todo o conteúdo do site, ver/gerenciar newsletter
  e mensagens, mas não pode criar nem remover usuárias.

## Stack usada

- **Backend**: Node.js, Express, SQLite (via `better-sqlite3`), autenticação
  por JWT, upload de imagens com `multer`.
- **Frontend**: React 18, React Router, Vite. Sem dependência de framework de
  CSS — os estilos seguem a identidade visual original do REJORC (cores,
  tipografia Baloo 2 + Nunito Sans).
