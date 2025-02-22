#!/bin/bash

# SSH details
SSH_HOST="root@5.161.86.130"

# Deploy commands
ssh $SSH_HOST "cd /var/www/midnightspa && \
  git pull origin main && \
  rm -rf .next node_modules/.cache && \
  cp .env.production .env && \
  npm install && \
  NODE_ENV=production npm run build && \
  pm2 restart midnightspa"

# Wait for the server to restart
sleep 5

# Trigger revalidation
curl -X POST "https://themidnightspa.com/api/revalidate" \
  -H "Content-Type: application/json" \
  -d "{\"path\": \"/\", \"secret\": \"VvyDlerL6Oq1D9461Lc4uoJavjdoYwNuDDKDDm7Nsjc=\"}"

echo "Deployment and revalidation completed" 