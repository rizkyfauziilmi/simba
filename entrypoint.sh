#!/bin/sh
set -e

# echo "🚀 Running Prisma migrate deploy..."
# npx prisma migrate deploy
# echo "✅ Prisma migration complete!"

echo "Starting Next.js server on port $PORT..."

node server.js
