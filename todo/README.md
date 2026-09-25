# Todo App

A full-stack Todo application with a **React + Vite** frontend and an **ASP.NET Core + MongoDB** backend.

## Project structure

```
todo/
├── todo-client/      # React frontend (Vite)
└── TodoApi/          # ASP.NET Core Web API (.NET 10)
```

---

## Running locally

### 1 — Backend

Requires [.NET 10 SDK](https://dotnet.microsoft.com/download) and a running MongoDB instance (default: `mongodb://localhost:27017`).

```bash
cd TodoApi
dotnet run
# API available at http://localhost:5267
```

### 2 — Frontend

Requires [Node.js 18+](https://nodejs.org/).

```bash
cd todo-client
npm install
npm run dev
# App available at http://localhost:5173
# /api/* requests are proxied to the backend automatically
```

---

## Deploying to Cloudflare Pages (drag-and-drop)

1. **Start / deploy your backend** somewhere with a public URL (Railway, Render, Azure, VPS, etc.) and note the URL, e.g. `https://todo-api.example.com`.

2. **Build the frontend:**

   ```bash
   cd todo-client
   # Create a .env file (git-ignored) with your API host:
   echo "VITE_API_BASE_URL=https://todo-api.example.com" > .env
   npm install
   npm run build
   ```

3. **Upload to Cloudflare Pages:**
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com) → **Pages** → **Upload assets**.
   - Drag and drop the `todo-client/dist/` folder.
   - Done! The included `_redirects` file ensures SPA routing works correctly.

---

## Deploying via GitHub (CI)

Connect this repo to Cloudflare Pages and configure:

| Setting | Value |
|---|---|
| Build command | `cd todo-client && npm install && npm run build` |
| Build output directory | `todo-client/dist` |
| Environment variable | `VITE_API_BASE_URL` = `https://your-api-host` |

---

## Environment variables

| Variable | Required in | Description |
|---|---|---|
| `VITE_API_BASE_URL` | Frontend (prod build) | Base URL of the deployed API. Empty = use Vite proxy (local dev). |
| `TodoDatabase__ConnectionString` | Backend | MongoDB connection string |
| `TodoDatabase__DatabaseName` | Backend | MongoDB database name |
| `TodoDatabase__TodoItemsCollectionName` | Backend | Collection name |

See [`todo-client/.env.example`](todo-client/.env.example) for a template.
