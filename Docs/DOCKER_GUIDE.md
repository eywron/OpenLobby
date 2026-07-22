# Docker Development Guide

OpenLobby includes Docker configurations for both local development and production.

## Local Development (Infrastructure Only)

For the best developer experience, you run the frontend and backend locally with `pnpm run dev`, while Docker handles the infrastructure (Database, Redis, Storage).

### Starting Infrastructure

```bash
docker compose -f docker-compose.dev.yml up -d
```

This starts:

- PostgreSQL on port 5432
- Redis on port 6379
- MinIO on port 9000 (Console on 9001)

### Stopping Infrastructure

```bash
docker compose -f docker-compose.dev.yml stop
```

### Wiping Data

If you need to reset the database and storage:

```bash
docker compose -f docker-compose.dev.yml down -v
```

## Full Stack Docker Deployment

If you want to run the entire stack (including the Node.js apps) in Docker locally to simulate production:

```bash
docker compose up --build
```

This uses the production multi-stage Dockerfiles for both frontend and backend.
