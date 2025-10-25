# Database Setup Guide

This project uses PostgreSQL as its database. There are two configurations available:

## 🚀 Development Setup (Recommended for local development)

For local development, you can run **only PostgreSQL** in Docker while running your Next.js app normally on your host machine.

### 1. Start PostgreSQL for Development

```bash
npm run dev:db
```

This will:
- Start a PostgreSQL 17 container in the background
- Expose PostgreSQL on `localhost:5432`
- Persist data in a Docker volume named `postgres_dev_data`
- Use credentials from `.env.local`

### 2. Run Database Migrations

```bash
npm run db:push
# or for production-style migrations
npm run db:migrate
```

### 3. Start Your Next.js Development Server

```bash
npm run dev
```

Your app will connect to PostgreSQL at `localhost:5432` using the `DATABASE_URL` from `.env.local`.

### Development Database Commands

```bash
# Start PostgreSQL container
npm run dev:db

# Stop PostgreSQL container (keeps data)
npm run dev:db:stop

# View PostgreSQL logs
npm run dev:db:logs

# Stop and delete PostgreSQL data
npm run dev:db:clean

# Open Prisma Studio to view/edit data
npm run db:studio
```

---

## 🐳 Production Setup (Full Docker Compose)

For production or when you want to run everything in Docker:

### 1. Build and Start All Services

```bash
npm run docker:up
```

This will:
- Build the Next.js application Docker image
- Start PostgreSQL container
- Start the web application container
- Expose the app on `localhost:3000`
- Use credentials from `.env`

### Production Docker Commands

```bash
# Build and start all services
npm run docker:up

# Start in detached mode (background)
npm run docker:up:detached

# Stop all services
npm run docker:down

# View logs
npm run docker:logs

# Clean everything (removes images and volumes)
npm run docker:clean

# Rebuild web service only
npm run docker:rebuild:web
```

---

## 📋 Environment Files

### `.env.local` (Development)
Used when running Next.js locally with `npm run dev`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"
```

### `.env` (Production/Docker)
Used when running the full Docker Compose setup:
```
DATABASE_URL="postgresql://user:password@postgres:5432/mydb?schema=public"
```

**Note the difference**: 
- Development uses `@localhost` (connecting from host machine)
- Production uses `@postgres` (Docker service name for container-to-container networking)

---

## 🔧 Database Management

### Connect to PostgreSQL Directly

```bash
# Using psql (if installed locally)
psql -h localhost -U user -d mydb

# Or using Docker
docker compose -f docker-compose.dev.yml exec postgres psql -U user -d mydb
```

### Reset Database

```bash
npm run db:reset
```

### Seed Database

```bash
npm run db:seed
```

---

## 🆘 Troubleshooting

### PostgreSQL won't start
```bash
# Check if port 5432 is already in use
lsof -i :5432

# Clean up and restart
npm run dev:db:clean
npm run dev:db
```

### Connection refused error
- Make sure PostgreSQL is running: `docker ps`
- Check you're using the correct `.env.local` file for development
- Verify the `DATABASE_URL` has `@localhost` not `@postgres`

### Prisma Client issues
```bash
# Regenerate Prisma Client
npx prisma generate
```

---

## 📊 Database Credentials

**Default credentials** (change these for production!):
- **User**: `user`
- **Password**: `password`
- **Database**: `mydb`
- **Port**: `5432`

These are defined in:
- `docker-compose.dev.yml` for development
- `docker-compose.yml` for production