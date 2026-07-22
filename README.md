# OpenLobby

OpenLobby is a modern, minimalist social media platform designed for speed, simplicity, and a distraction-free experience.

## Technology Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS, shadcn/ui
- **Backend**: Express 5 (Node.js), TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Firebase Authentication (Google, Email/Password)
- **Storage**: MinIO (S3-compatible)
- **Cache & Queues**: Redis
- **Deployment**: Docker & Coolify

## Getting Started

### Prerequisites

- Node.js >= 22
- pnpm >= 10
- Docker Desktop (for local services)

### Development Setup

1. Copy the environment file:

   ```bash
   cp .env.example .env
   ```

2. Configure Firebase and MinIO in your `.env` file.

3. Start local infrastructure services (PostgreSQL, Redis, MinIO):

   ```bash
   docker compose -f docker-compose.dev.yml up -d
   ```

4. Install dependencies:

   ```bash
   pnpm install
   ```

5. Run database migrations:

   ```bash
   cd backend && pnpm prisma db push
   ```

6. Start both frontend and backend:
   ```bash
   pnpm run dev
   ```

## Production Deployment

OpenLobby is optimized for self-hosting via Coolify using Nixpacks or Docker Compose. See [COOLIFY_DEPLOYMENT.md](Docs/COOLIFY_DEPLOYMENT.md) for full instructions.

## Documentation

Full architectural documentation is available in the `/Docs` directory.

## License

MIT
