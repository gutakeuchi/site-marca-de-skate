# Wolf Board API (C# + PostgreSQL)

API REST em **ASP.NET Core (.NET 10)** com **Minimal APIs**, **EF Core** e **PostgreSQL**.

## Endpoints

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/api/health` | não | Health check |
| POST | `/api/auth/login` | não | Login → JWT |
| GET | `/api/auth/me` | JWT | Usuário atual |
| GET | `/api/categories` | não | Categorias |
| GET | `/api/products` | não | Lista (`?category=&q=`) |
| GET | `/api/products/{id}` | não | Detalhe |
| GET | `/api/cart` | JWT | Carrinho |
| POST | `/api/cart/items` | JWT | Adiciona item |
| PUT | `/api/cart/items` | JWT | Atualiza qty |
| DELETE | `/api/cart/items/{productId}/{size}` | JWT | Remove item |
| DELETE | `/api/cart` | JWT | Esvazia |

## Pré-requisitos

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- PostgreSQL 14+

## Banco local

```bash
sudo -u postgres psql <<'SQL'
CREATE ROLE wolfboard LOGIN PASSWORD 'wolfboard';
CREATE DATABASE wolfboard OWNER wolfboard;
GRANT ALL ON SCHEMA public TO wolfboard;
SQL
```

Connection string padrão em `appsettings.json`:

```
Host=localhost;Port=5432;Database=wolfboard;Username=wolfboard;Password=wolfboard
```

## Rodar a API

```bash
cd api/WolfBoard.Api
dotnet run --launch-profile http
```

Sobe em `http://localhost:5271`. Na primeira execução aplica migrations e faz seed de:

- 19 categorias + ~170 produtos (do catálogo do front)
- usuários demo (mesmos emails do site), senha: `admin`

## Front + API

```bash
# terminal 1
cd api/WolfBoard.Api && dotnet run --launch-profile http

# terminal 2
npm install && npm run dev
```

O Vite faz proxy de `/api` → `http://localhost:5271`.

Login no site passa a usar a API (JWT). Carrinho sincroniza no PostgreSQL quando o usuário está autenticado; sem login continua no `localStorage`.

## Deploy na Azure (produção)

Guia completo passo a passo: **[docs/azure-deploy.md](../docs/azure-deploy.md)**

Inclui App Service + PostgreSQL + Static Web Apps + GitHub Actions.

## Exemplo de login

```bash
curl -s http://localhost:5271/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"gustavo.takeuchi@etec.sp.gov.br","password":"admin"}'
```
