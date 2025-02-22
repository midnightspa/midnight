#!/bin/bash

# Pull latest changes
git pull origin main

# Clean cache and install dependencies
rm -rf .next node_modules/.cache
npm install

# Build the application
NODE_ENV=production npm run build

# Trigger revalidation
curl -X POST https://themidnightspa.com/api/revalidate \
  -H "Content-Type: application/json" \
  -H "x-revalidate-token: $REVALIDATE_TOKEN" \
  -d '{"path":"/"}'

# Restart the application
pm2 restart midnightspa 