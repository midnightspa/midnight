#!/bin/bash

# Pull latest changes
git pull origin main

# Clean cache and install dependencies
rm -rf .next node_modules/.cache
npm install

# Build the application
NODE_ENV=production npm run build

# Clear server-side cache
rm -rf .next/cache/*

# Restart the application with cache clearing
pm2 delete midnightspa || true
pm2 start npm --name "midnightspa" -- start 