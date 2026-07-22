# Coolify Deployment Guide

OpenLobby is optimized for deployment on Coolify, an open-source self-hosting PaaS.

## Prerequisites

- A server running Coolify.
- A domain name.
- Firebase project credentials.

## Deployment Strategy

We deploy the application using Coolify's **Docker Compose** support.

### 1. Create a New Project

In Coolify, create a new Project and Environment (e.g., `production`).

### 2. Add Resource

Select **Docker Compose**.
You can either link the GitHub repository or paste the `docker-compose.yml` file directly.

### 3. Environment Variables

Before starting the deployment, you must set all required environment variables in the Coolify UI.
Refer to the `.env.example` file for the complete list.
Make sure you include:

- `FIREBASE_PRIVATE_KEY` (Ensure line breaks are preserved or handled correctly).
- `DATABASE_URL` (Point to your managed PostgreSQL or the one deployed in the compose stack).
- `MINIO_ACCESS_KEY` / `MINIO_SECRET_KEY`

### 4. Storage & Persistence

Coolify automatically manages Docker volumes. The `docker-compose.yml` file defines named volumes for:

- `postgres-data`
- `redis-data`
- `minio-data`

### 5. Domains & Routing

In the Coolify dashboard, assign your domains:

- Frontend: `openlobby.yourdomain.com`
- Backend: `api.openlobby.yourdomain.com` (Ensure `CORS_ORIGIN` matches the frontend domain).
- MinIO Console (Optional): `minio-console.yourdomain.com`
- MinIO API: `minio.yourdomain.com`

Coolify will automatically provision SSL certificates via Let's Encrypt.
