# Docker Compose para desenvolvimento — design

**Data:** 2026-07-13
**Objetivo:** rodar o projeto inteiro (API + site) com um único comando
(`docker compose up`), sem precisar de Node.js instalado na máquina.

## Decisões

- **Formato:** Docker Compose com dois serviços (`backend` e `frontend`),
  em **modo desenvolvimento** — código montado por volume, com hot reload
  (`node --watch` na API, Vite no site).
- **Persistência:** a pasta `./backend` é montada dentro do container, então
  `data.sqlite` e `uploads/` continuam no disco do usuário, exatamente como
  ao rodar sem Docker. Backup não muda.
- **node_modules:** fica em volume nomeado dentro do container (o
  `better-sqlite3` é binário nativo de Linux; compartilhar com o macOS
  quebraria).
- **Variáveis de ambiente:** na primeira subida, o backend copia
  `.env.example` → `.env` se ainda não existir (o arquivo aparece em
  `backend/.env` no host e pode ser editado normalmente). Os valores do
  `.env.example` já funcionam para desenvolvimento. O frontend usa o
  fallback `http://localhost:4000` já existente em `src/api.js`.
- **Seed:** roda em toda subida do backend (`npm run seed && npm run dev`);
  é idempotente — não duplica admin nem conteúdo.
- **Imagem base:** `node:22-bookworm-slim` nos dois serviços.

## Arquivos

- `docker-compose.yml` (raiz)
- `backend/Dockerfile`, `backend/.dockerignore`
- `frontend/Dockerfile`, `frontend/.dockerignore`
- Seção "Rodando com Docker" no `README.md`

## Fora de escopo

- Build de produção (nginx + `vite build`) — o README já descreve o caminho
  de deploy sem Docker; um `docker-compose.prod.yml` pode ser adicionado
  depois se necessário.
