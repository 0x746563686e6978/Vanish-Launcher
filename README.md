# Vanish Launcher

A modern desktop application built with **Tauri + React + Node.js**, featuring Discord OAuth login, a license system, and a cheat loader with a glassmorphism UI.

## Features

- 🎮 Modern glassmorphism dark UI
- 🔐 Discord OAuth2 authentication
- 🔑 License redeem system
- ⚔️ CS2 + Minecraft cheat loaders
- 🖥️ Frameless Tauri window with custom drag region
- 🐳 Dockerized backend

---

## Project Structure

```
root/
├── docker-compose.yml
├── .env.example
├── README.md
├── backend/            # Node.js Express API
│   ├── Dockerfile
│   ├── package.json
│   ├── prisma/         # Prisma schema + SQLite DB
│   └── src/
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       ├── services/
│       └── utils/
├── app/                # React + Vite frontend
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   └── store/
│   └── tauri.conf.json
└── src-tauri/          # Tauri Rust shell
    ├── Cargo.toml
    └── src/
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Rust](https://www.rust-lang.org/) (for Tauri)
- [Docker](https://www.docker.com/) (for backend)
- A [Discord Application](https://discord.com/developers/applications) with OAuth2 configured

---

## Setup

### 1. Clone & configure environment

```bash
git clone <repo-url>
cd Vanish-Launcher
cp .env.example .env
# Edit .env with your Discord credentials and JWT secret
```

### 2. Discord OAuth2 Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to **OAuth2** → **General**
4. Add redirect URL: `http://localhost:4000/auth/discord/callback`
5. Copy **Client ID** and **Client Secret** to `.env`

### 3. Start the Backend (Docker)

```bash
docker-compose up -d
```

The backend will be available at `http://localhost:4000`.

To initialize the database:

```bash
docker-compose exec backend npx prisma db push
```

### 4. Run the Frontend (Tauri Dev)

```bash
cd app
npm install
npm run tauri dev
```

---

## Development Mode (without Docker)

```bash
# Terminal 1 — Backend
cd backend
npm install
cp ../.env.example .env   # configure env
npx prisma db push
npm run dev

# Terminal 2 — Frontend
cd app
npm install
npm run tauri dev
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `DISCORD_CLIENT_ID` | Discord app client ID |
| `DISCORD_CLIENT_SECRET` | Discord app client secret |
| `DISCORD_REDIRECT_URI` | OAuth callback URL |
| `JWT_SECRET` | Secret key for JWT signing |
| `JWT_EXPIRY` | Token expiry (default `7d`) |
| `DATABASE_URL` | Prisma DB URL (SQLite: `file:./vanish.db`) |
| `PORT` | Backend port (default `4000`) |
| `VITE_API_URL` | Frontend API base URL |
| `FRONTEND_URL` | Allowed CORS origin |

---

## How Discord OAuth Works

1. Frontend calls `GET /auth/discord` → backend returns Discord OAuth URL
2. User is redirected to Discord in their browser
3. Discord redirects back to `GET /auth/discord/callback?code=...`
4. Backend exchanges code for access token → fetches user profile
5. Backend upserts user in DB → issues JWT
6. JWT is returned to frontend → stored in Zustand persisted store
7. All subsequent API calls include `Authorization: Bearer <token>`

---

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/health` | No | Health check |
| GET | `/auth/discord` | No | Get Discord OAuth URL |
| GET | `/auth/discord/callback` | No | OAuth callback |
| GET | `/auth/me` | Yes | Get current user |
| POST | `/license/redeem` | Yes | Redeem license key |
| GET | `/license/status` | Yes | Get license status |
| POST | `/cheat/cs2/load` | Yes | Initialize CS2 loader |
| GET | `/cheat/minecraft/download` | Yes | Download Minecraft JAR |

---

## Docker Usage

```bash
# Start backend
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop
docker-compose down

# Rebuild after code changes
docker-compose up -d --build
```

---

## License

MIT
