##### DEPENDENCIES
# Use node:20-alpine for a smaller, Musl-based image
FROM node:20-alpine AS deps
# Install libc6-compat for compatibility and openssl as required by the Prisma engine
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copy schema.prisma and other files needed for generation
COPY prisma ./

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

RUN \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then for i in 1 2 3; do npm ci && break || sleep 5; done; \
    elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm i; \
    else echo "Lockfile not found." && exit 1; \
    fi

# Generate Prisma Client (will use the linux-musl-openssl-3.0.x target)
RUN npx prisma generate

##### BUILDER
FROM node:20-alpine AS builder
WORKDIR /app

# Copy node_modules and the generated Prisma Client from the 'deps' stage
COPY --from=deps /app/node_modules ./node_modules
# The generated client is created inside the node_modules during 'deps', but
# since your schema.prisma specifies an output outside of node_modules (../lib/generated/prisma),
COPY --from=deps ./lib/generated/prisma ./lib/generated/prisma

COPY . .

# Run the build command (Next.js standalone build)
RUN \
    if [ -f yarn.lock ]; then yarn build; \
    elif [ -f package-lock.json ]; then npm run build; \
    elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm run build; \
    else echo "Lockfile not found." && exit 1; \
    fi

##### RUNNER
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install curl to healthcheck
RUN apk add --no-cache curl

COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

RUN chmod +x ./entrypoint.sh

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["./entrypoint.sh"]
