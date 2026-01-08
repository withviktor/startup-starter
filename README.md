# Startup Starter

**Build anything, ship anywhere.**

A modern full-stack monorepo boilerplate for building web applications fast.

## Stack

- **Frontend:** Next.js 16, React 19, TailwindCSS
- **Backend:** NestJS 11, Prisma ORM, PostgreSQL
- **Auth:** Better Auth
- **Tooling:** Turborepo, pnpm, Biome, TypeScript

## Structure

```
├── apps/
│   ├── server/     # NestJS API (port 3000)
│   └── web/        # Next.js app (port 3001)
├── packages/
│   ├── config/     # Shared TypeScript configs
│   └── env/        # Type-safe environment variables
└── docker-compose.yml
```

## Getting Started

```bash
# Install dependencies
pnpm install

# Start PostgreSQL
docker compose up -d

# Push database schema
pnpm --filter server db:push

# Run development servers
pnpm dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development |
| `pnpm dev:web` | Start web app only |
| `pnpm dev:server` | Start server only |
| `pnpm build` | Build all apps |
| `pnpm check` | Run linting and formatting |

## Environment

Copy the example files and configure:

```bash
cp apps/server/.env.example apps/server/.env
cp apps/web/.env.example apps/web/.env
```

## API Docs

Scalar API reference available at `http://localhost:3000/reference` when server is running.
