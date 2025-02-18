#!/bin/bash

# Pull latest changes
git pull

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Build the application
npm run build

# Generate sitemap
npx ts-node app/scripts/seo/generate-sitemap.ts

# Restart PM2 process
pm2 restart midnightspa 