OPENLOBBY MASTER AI SPECIFICATION

Part 12 — Full Production Deployment Guide

Version: V1.0

---

1. ARCHITECTURE OVERVIEW

OpenLobby deploys to the following services:

- Frontend: Vercel (Next.js)
- Backend: Azure App Service (Express + Node.js)
- Database: Azure Database for PostgreSQL Flexible Server
- Storage: Azure Blob Storage
- Cache: Azure Cache for Redis
- Email: Resend

---

2. PREREQUISITES

- Azure account with active subscription (Azure for Students supported)
- Vercel account connected to GitHub
- Resend account at resend.com
- Azure CLI installed locally
- Node.js 20+ and Git installed
- Repository pushed to GitHub

---

3. AZURE RESOURCE GROUP

Create a resource group to contain all Azure resources:

az group create --name openlobby-rg --location eastus

---

4. AZURE DATABASE FOR POSTGRESQL

Create a PostgreSQL Flexible Server:

az postgres flexible-server create \
  --resource-group openlobby-rg \
  --name openlobby-db \
  --location eastus \
  --admin-user openlobbyadmin \
  --admin-password "<PASSWORD>" \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --storage-size 32 \
  --version 16 \
  --public-access 0.0.0.0

Create the database:

az postgres flexible-server db create \
  --resource-group openlobby-rg \
  --server-name openlobby-db \
  --database-name openlobby

Connection string format:
postgresql://openlobbyadmin:<PASSWORD>@openlobby-db.postgres.database.azure.com:5432/openlobby?sslmode=require

Run Prisma schema push from local:
DATABASE_URL="<connection_string>" npx prisma db push

---

5. AZURE BLOB STORAGE

Create storage account:

az storage account create \
  --resource-group openlobby-rg \
  --name openlobbystorage \
  --location eastus \
  --sku Standard_LRS \
  --kind StorageV2

Create media container:

az storage container create \
  --account-name openlobbystorage \
  --name openlobby-media \
  --public-access blob

Get connection string:

az storage account show-connection-string \
  --resource-group openlobby-rg \
  --name openlobbystorage \
  --output tsv

---

6. AZURE CACHE FOR REDIS

Create Redis instance (takes 15-20 minutes):

az redis create \
  --resource-group openlobby-rg \
  --name openlobby-cache \
  --location eastus \
  --sku Basic \
  --vm-size c0

Redis URL format:
rediss://:<PRIMARY_ACCESS_KEY>@openlobby-cache.redis.cache.windows.net:6380

Note: Azure Redis uses rediss:// (TLS) on port 6380.

---

7. RESEND EMAIL SERVICE

1. Sign up at resend.com.
2. Create an API key with Sending access.
3. Copy the key (starts with re_...).

---

8. BACKEND DEPLOYMENT (AZURE APP SERVICE)

Create App Service:

az appservice plan create \
  --resource-group openlobby-rg \
  --name openlobby-plan \
  --sku F1 \
  --is-linux

az webapp create \
  --resource-group openlobby-rg \
  --plan openlobby-plan \
  --name openlobby-api \
  --runtime "NODE:20-lts"

Configure environment variables:

az webapp config appsettings set \
  --resource-group openlobby-rg \
  --name openlobby-api \
  --settings \
    NODE_ENV="production" \
    PORT="8080" \
    CORS_ORIGIN="https://openlobby.vercel.app" \
    DATABASE_URL="<postgresql_connection_string>" \
    JWT_ACCESS_SECRET="<random_64_char_hex>" \
    JWT_REFRESH_SECRET="<random_64_char_hex>" \
    AZURE_STORAGE_CONNECTION_STRING="<storage_connection_string>" \
    AZURE_STORAGE_CONTAINER="openlobby-media" \
    REDIS_URL="<redis_url>" \
    RESEND_API_KEY="<resend_api_key>"

Set startup command:

az webapp config set \
  --resource-group openlobby-rg \
  --name openlobby-api \
  --startup-file "npm run start"

Deploy via GitHub Actions through Azure Portal Deployment Center.

---

9. FRONTEND DEPLOYMENT (VERCEL)

1. Import eywron/OpenLobby on Vercel.
2. Set Framework Preset to Next.js.
3. Set Root Directory to frontend.
4. Add environment variable:
   NEXT_PUBLIC_API_URL = https://openlobby-api.azurewebsites.net/api/v1
5. Deploy.

After deployment, update CORS_ORIGIN on Azure to match the Vercel domain.

---

10. VERIFICATION

1. Backend health: GET https://openlobby-api.azurewebsites.net/api/v1/health
2. Frontend loads at Vercel URL.
3. Registration and login work.
4. Posts can be created.
5. Search returns results.

---

End of Part 12
