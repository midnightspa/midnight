#!/bin/bash

echo "Starting deployment process..."

# Stop the current PM2 process
pm2 stop midnightspa || true
pm2 delete midnightspa || true

# Clean up
rm -rf .next
rm -rf node_modules/.cache
rm -rf /tmp/.next-*
npm cache clean --force

# Pull latest changes
git pull

# Fresh install of dependencies
rm -rf node_modules
npm install

# Generate Prisma client
npx prisma generate

# Build with cache disabled
NEXT_DISABLE_CACHE=1 NODE_OPTIONS='--max_old_space_size=4096' npm run build

# Start with PM2
NODE_ENV=production \
NEXT_RUNTIME=nodejs \
NEXT_DISABLE_CACHE=1 \
NEXT_TELEMETRY_DISABLED=1 \
pm2 start npm --name "midnightspa" -- start -- -p 3000

# Wait for the application to start
sleep 5

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