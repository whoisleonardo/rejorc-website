# Colocando o REJORC no ar de graça (Oracle Cloud + DuckDNS)

Este guia coloca **site + API + banco + uploads** no ar por **R$ 0/mês**,
usando:

- **Oracle Cloud Always Free** — servidor gratuito para sempre (pede um
  cartão no cadastro só para verificar identidade; o plano Always Free não
  gera cobrança).
- **DuckDNS** — subdomínio gratuito (ex: `rejorc.duckdns.org`).
- **Caddy** — HTTPS automático (Let's Encrypt), já embutido no
  `docker-compose.prod.yml` deste repositório.

No modo produção, site e API ficam no **mesmo domínio**: o Caddy serve o
site compilado e repassa `/api` e `/uploads` para o backend. O banco e as
imagens ficam num volume Docker (`backend_data`), fora do código.

## 1. Criar o servidor na Oracle

1. Crie a conta em <https://www.oracle.com/cloud/free/> (escolha a região
   **Brazil East (São Paulo)** se disponível).
2. Menu **Compute → Instances → Create instance**:
   - Imagem: **Ubuntu 24.04**.
   - Shape: **Ampere (ARM) A1.Flex** — até 4 OCPUs e 24 GB de RAM entram no
     Always Free (se der "out of capacity", tente outro horário ou o shape
     AMD `VM.Standard.E2.1.Micro`).
   - Baixe/guarde a **chave SSH** gerada.
3. Ainda na Oracle, libere as portas 80 e 443: **Networking → Virtual cloud
   networks → sua VCN → Security List → Add Ingress Rules** — origem
   `0.0.0.0/0`, protocolo TCP, portas `80` e `443`.
4. Anote o **IP público** da instância.

## 2. Apontar o domínio (DuckDNS)

1. Entre em <https://www.duckdns.org> (login com GitHub/Google).
2. Crie um subdomínio (ex: `rejorc`) e aponte-o para o IP público da
   instância. Pronto: `rejorc.duckdns.org` → seu servidor.

## 3. Preparar o servidor

Conecte por SSH e instale Docker:

```bash
ssh -i sua-chave.key ubuntu@IP_DA_INSTANCIA
sudo apt update && sudo apt install -y docker.io docker-compose-v2 git
sudo usermod -aG docker ubuntu   # depois saia e entre de novo no SSH
```

No Ubuntu da Oracle, o firewall interno (iptables) também precisa liberar
80/443:

```bash
sudo iptables -I INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT -p tcp --dport 443 -j ACCEPT
sudo netfilter-persistent save
```

## 4. Baixar o projeto e configurar

```bash
git clone https://github.com/SEU_USUARIO/rejorc-app.git
cd rejorc-app

# Dominio usado pelo Caddy e pelo build do site
echo "DOMAIN=rejorc.duckdns.org" > .env

# Configuracao do backend
cp backend/.env.example backend/.env
nano backend/.env
```

No `backend/.env`, para produção:

- `JWT_SECRET`: gere um novo com `openssl rand -hex 32`.
- `ADMIN_PASSWORD`: defina uma senha forte nova.
- `FRONTEND_URL` e `API_PUBLIC_URL`: podem ficar como estão — o
  `docker-compose.prod.yml` já injeta `https://SEU_DOMINIO` nos dois.
- `BREVO_API_KEY`, `NEWSLETTER_FROM_EMAIL`, `NEWSLETTER_FROM_NAME`: os
  mesmos valores da conta Brevo (ver seção de newsletter do README).

## 5. Subir

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Em 1–2 minutos: site em `https://rejorc.duckdns.org`, painel em
`https://rejorc.duckdns.org/acesso`. O certificado HTTPS é emitido
automaticamente na primeira visita.

## 6. Atualizar o site quando o código mudar

```bash
cd rejorc-app
git pull
docker compose -f docker-compose.prod.yml up -d --build
```

Os dados não são afetados (ficam no volume `backend_data`).

## 7. Backup (importante!)

O banco e todas as imagens enviadas ficam no volume `backend_data`. Para
gerar um backup:

```bash
docker compose -f docker-compose.prod.yml exec backend tar czf - -C /data . > backup-$(date +%F).tar.gz
```

Baixe para sua máquina com `scp`:

```bash
scp -i sua-chave.key ubuntu@IP_DA_INSTANCIA:~/rejorc-app/backup-*.tar.gz .
```

Sugestão: rode isso uma vez por semana (ou agende com `crontab -e`). Para
restaurar, basta descompactar o conteúdo de volta em `/data` no container.

## Problemas comuns

- **"out of capacity" ao criar a instância ARM**: tente outro horário ou o
  shape AMD micro; a demanda pelo Always Free varia.
- **Site não abre**: confira as duas camadas de firewall (Security List da
  Oracle **e** iptables do Ubuntu) e se o DuckDNS aponta para o IP certo.
- **HTTPS não emite**: o domínio precisa estar apontando para o IP antes do
  primeiro `up`; se mudou depois, `docker compose -f docker-compose.prod.yml restart web`.
