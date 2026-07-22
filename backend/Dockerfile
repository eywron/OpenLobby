# ---- Base ----
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.12.1 --activate
WORKDIR /app

# ---- Dependencies ----
FROM base AS deps
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY backend/package.json ./backend/
RUN pnpm install --filter @openlobby/backend --frozen-lockfile 2>/dev/null || pnpm install --filter @openlobby/backend

# ---- Build ----
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/backend/node_modules ./backend/node_modules
COPY tsconfig.base.json ./
COPY backend ./backend
RUN cd backend && pnpm prisma generate && pnpm run build

# ---- Production ----
FROM node:22-alpine AS production
RUN corepack enable && corepack prepare pnpm@10.12.1 --activate
WORKDIR /app

ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/backend/node_modules ./backend/node_modules
COPY --from=build /app/backend/dist ./backend/dist
COPY --from=build /app/backend/prisma ./backend/prisma
COPY --from=build /app/backend/node_modules/.prisma ./backend/node_modules/.prisma
COPY backend/package.json ./backend/

EXPOSE 4000

HEALTHCHECK --interval=15s --timeout=10s --retries=3 --start-period=30s \
  CMD node -e "fetch('http://localhost:4000/api/v1/health').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

CMD ["node", "backend/dist/index.js"]
