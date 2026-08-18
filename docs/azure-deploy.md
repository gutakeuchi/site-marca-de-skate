# Deploy Wolf Board na Azure (mercado real)

Guia passo a passo para publicar o **front (React)** e a **API (C#)** na nuvem, como empresas fazem.

## Arquitetura

```
Usuário
   │
   ▼
Azure Static Web Apps  ──►  React (dist/)
   │   https://wolfboard-web.azurestaticapps.net
   │
   │  fetch(VITE_API_URL + /api/...)
   ▼
Azure App Service  ──►  ASP.NET Core API
   │   https://wolfboard-api.azurewebsites.net
   │
   ▼
Azure Database for PostgreSQL  ──►  produtos, usuários, carrinho
```

| Componente | Serviço Azure | Função |
|------------|---------------|--------|
| Front | **Static Web Apps** | Site React estático |
| API | **App Service** (Linux, .NET 10) | Backend C# |
| Banco | **PostgreSQL Flexible Server** | Dados |
| CI/CD | **GitHub Actions** | Deploy automático no push |

---

## Parte 1 — Criar recursos no Portal Azure

Acesse [portal.azure.com](https://portal.azure.com) (conta gratuita serve para estudar).

### 1.1 Resource Group

1. **Create a resource** → **Resource group**
2. Nome: `rg-wolfboard`
3. Region: `Brazil South` (ou East US se Brazil South não tiver o serviço)
4. Create

### 1.2 PostgreSQL

1. **Create a resource** → **Azure Database for PostgreSQL Flexible Server**
2. Configuração sugerida:
   - Resource group: `rg-wolfboard`
   - Server name: `wolfboard-db` (único globalmente)
   - Region: mesma do resource group
   - PostgreSQL version: 16
   - Workload: Development (mais barato)
   - Admin: `wolfadmin`
   - Password: **anote uma senha forte**
3. Networking → **Allow public access** (para simplificar; em produção real use Private Link)
4. Create (demora alguns minutos)

Depois de criado:

1. Abra o servidor → **Databases** → **Add** → nome: `wolfboard`
2. **Connection security** → adicione seu IP se necessário
3. Anote a **connection string** (formato):

```
Host=wolfboard-db.postgres.database.azure.com;Port=5432;Database=wolfboard;Username=wolfadmin;Password=SUA_SENHA;Ssl Mode=Require;
```

### 1.3 App Service (API)

1. **Create a resource** → **Web App**
2. Configuração:
   - Name: `wolfboard-api` → URL: `https://wolfboard-api.azurewebsites.net`
   - Publish: **Code**
   - Runtime: **.NET 10 (LTS)** no **Linux**
   - Region: mesma do grupo
   - Plan: Basic B1 ou Free F1 (Free tem limitações)
3. Create

**App Settings** (Configuration → Application settings):

| Nome | Valor |
|------|-------|
| `ASPNETCORE_ENVIRONMENT` | `Production` |
| `ConnectionStrings__Default` | connection string do Postgres |
| `Jwt__Key` | chave longa e aleatória (mín. 32 caracteres) |
| `Jwt__Issuer` | `WolfBoard` |
| `Jwt__Audience` | `WolfBoard.Web` |
| `Cors__AllowedOrigins__0` | `https://SEU-FRONT.azurestaticapps.net` |
| `EnableOpenApi` | `true` (só em homolog; `false` em prod real) |

> No Azure, `__` (dois underscores) vira `:` na configuração .NET.

Salve e **Restart** o App Service.

### 1.4 Static Web App (Front)

1. **Create a resource** → **Static Web App**
2. Configuração:
   - Name: `wolfboard-web`
   - Plan: Free
   - Region: escolha a mais próxima
   - Deployment: **GitHub** → autorize e selecione `gutakeuchi/site-marca-de-skate`
   - Branch: `main`
   - Build Presets: **Custom**
   - App location: `/`
   - Output location: `dist`
3. Create

O Azure cria um workflow no GitHub. Você pode usar o nosso em `.github/workflows/deploy-frontend-azure.yml` (ajuste se duplicar).

---

## Parte 2 — GitHub Secrets (CI/CD)

No GitHub: **Settings → Secrets and variables → Actions → New repository secret**

| Secret | Onde pegar |
|--------|------------|
| `AZURE_API_APP_NAME` | Nome do App Service, ex: `wolfboard-api` |
| `AZURE_API_PUBLISH_PROFILE` | App Service → **Download publish profile** (XML inteiro) |
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | Static Web App → **Manage deployment token** |
| `VITE_API_URL` | URL da API, ex: `https://wolfboard-api.azurewebsites.net` |

---

## Parte 3 — Primeiro deploy

### API manual (teste rápido)

No seu PC, com Azure CLI ou publish profile:

```bash
cd api/WolfBoard.Api
dotnet publish -c Release -o ./publish
```

No Portal: App Service → **Advanced Tools (Kudu)** → Zip Deploy, ou use o GitHub Action.

### Automático (recomendado)

1. Faça merge do PR da API na `main`
2. Push dispara `.github/workflows/deploy-api-azure.yml`
3. Push no front dispara `deploy-frontend-azure.yml`

---

## Parte 4 — Testar na nuvem

### Health check

```bash
curl https://wolfboard-api.azurewebsites.net/api/health
```

Resposta esperada: `{"status":"ok"}`

### OpenAPI / “Swagger”

Com `EnableOpenApi=true`:

```
https://wolfboard-api.azurewebsites.net/openapi/v1.json
```

Importe no [Swagger Editor](https://editor.swagger.io/) ou use extensão do VS Code.

> Em produção, muitas empresas **desligam** OpenAPI público ou protegem com login.

### Login

```bash
curl -X POST https://wolfboard-api.azurewebsites.net/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"gustavo.takeuchi@etec.sp.gov.br\",\"password\":\"admin\"}"
```

### Site

Abra a URL do Static Web App. O front usa `VITE_API_URL` definido no secret do GitHub.

---

## Parte 5 — Como funciona no mercado (resumo)

| Ambiente | Quem sobe | URL |
|----------|-----------|-----|
| **Local** | Dev na mão (`dotnet run`, `npm run dev`) | localhost |
| **Homolog** | Pipeline no merge para branch `staging` | `*-staging.azurewebsites.net` |
| **Produção** | Pipeline no merge para `main` | domínio da empresa |

Fluxo típico:

1. Dev abre PR
2. CI roda testes + build
3. Merge → deploy automático
4. Monitoramento (Application Insights, logs)
5. Secrets no Key Vault / App Settings (nunca no código)

---

## Parte 6 — Checklist de segurança (produção real)

- [ ] Trocar senha `admin` dos usuários demo
- [ ] `Jwt__Key` forte e só no Azure App Settings
- [ ] HTTPS em tudo
- [ ] Postgres sem IP público aberto (Private Endpoint)
- [ ] `EnableOpenApi=false` em produção
- [ ] Application Insights para logs
- [ ] Backups automáticos do Postgres

---

## Custos estimados (estudo)

| Serviço | Tier free/dev |
|---------|----------------|
| Static Web Apps | Free |
| App Service | F1 Free ou ~R$30/mês B1 |
| PostgreSQL Flexible | Burstable B1ms ~US$12/mês |

Use **Azure for Students** se tiver email `.edu` / ETEC.

---

## Problemas comuns

| Erro | Solução |
|------|---------|
| API 500 ao subir | Ver **Log stream** no App Service; quase sempre connection string |
| CORS no browser | Adicionar URL exata do Static Web App em `Cors__AllowedOrigins__0` |
| Front chama localhost | Secret `VITE_API_URL` errado ou build antigo |
| Migrations | Rodam no startup via `DbSeeder`; confira firewall do Postgres |

---

## Arquivos deste repo relacionados

| Arquivo | Função |
|---------|--------|
| `.github/workflows/deploy-api-azure.yml` | Deploy da API |
| `.github/workflows/deploy-frontend-azure.yml` | Deploy do React |
| `api/WolfBoard.Api/appsettings.Production.json` | Template prod |
| `.env.production.example` | URL da API no build do front |
