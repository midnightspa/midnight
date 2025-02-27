#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting Midnight Spa setup..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Check if database exists
echo "🔍 Checking database..."
if psql -lqt | cut -d \| -f 1 | grep -qw midnighsa; then
    echo "✅ Database 'midnighsa' already exists"
else
    echo "🛠️ Creating database 'midnighsa'..."
    createdb midnighsa
    echo "✅ Database created successfully"
fi

# Push schema to database
echo "🔄 Pushing schema to database..."
npx prisma db push

# Seed the database
echo "🌱 Seeding the database..."
npm run db:seed

echo "✨ Setup completed successfully!"
echo "🚀 Run 'npm run dev' to start the development server" 