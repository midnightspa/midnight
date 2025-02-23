#!/bin/bash

echo "Starting deployment process..."

# Stop the current PM2 process
pm2 stop midnightspa || true
pm2 delete midnightspa || true

# Clean up
rm -rf .next
rm -rf node_modules/.cache
rm -rf /tmp/.next-*
rm -rf .next/cache/*
npm cache clean --force

# Pull latest changes
git pull

# Fresh install of dependencies
rm -rf node_modules
npm install

# Install sharp globally
npm install -g sharp

# Generate Prisma client
npx prisma generate

# Build with cache disabled
NEXT_DISABLE_CACHE=1 NODE_OPTIONS='--max_old_space_size=4096' npm run build

# Clear any existing PM2 processes
pm2 flush
pm2 reset all

# Start with PM2
NODE_ENV=production \
NEXT_RUNTIME=nodejs \
NEXT_DISABLE_CACHE=1 \
NEXT_TELEMETRY_DISABLED=1 \
NEXT_SHARP_PATH=/usr/local/lib/node_modules/sharp \
pm2 start ecosystem.config.js

# Wait for the application to start
sleep 10

# Display status
pm2 list

# Check if the application is running
if curl -s -f -o /dev/null "http://localhost:3000"; then
    echo "Application is running successfully!"
else
    echo "Error: Application failed to start properly"
    pm2 logs midnightspa --lines 50
    exit 1
fi

echo "Deployment completed successfully!"