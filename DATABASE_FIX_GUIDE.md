# Database Connection Fix Guide

## Problem
Your Neon database connection is timing out at runtime even though `prisma db push` works.

## Root Causes
1. **Neon Free Tier Auto-Pause**: Neon databases pause after 5 minutes of inactivity
2. **Connection Pooling Issues**: The pooler URL may have connection limits
3. **Network/Firewall**: Your network might be blocking persistent connections

## Solutions (Try in Order)

### Solution 1: Use Direct Connection (Not Pooler)
The pooler URL (`-pooler`) is for serverless, but Next.js dev server needs direct connection.

**Update your .env:**
```env
# Use DIRECT connection (without -pooler)
DATABASE_URL="postgresql://neondb_owner:npg_E0vTjakig9se@ep-raspy-cloud-ah9nredu.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

### Solution 2: Wake Up Database Before Starting
Neon databases auto-pause. Wake it up first:

1. Go to https://console.neon.tech
2. Find your project
3. Click "Wake up" or run any query
4. Then start your dev server

### Solution 3: Add Connection Timeout Settings
Add these to your DATABASE_URL:

```env
DATABASE_URL="postgresql://neondb_owner:npg_E0vTjakig9se@ep-raspy-cloud-ah9nredu.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&connect_timeout=30&pool_timeout=30"
```

### Solution 4: Use Supabase (Free Alternative)
If Neon keeps timing out, use Supabase:

1. Go to https://supabase.com
2. Create new project
3. Get connection string from Settings > Database
4. Update DATABASE_URL in .env

### Solution 5: Local PostgreSQL with Docker
Most reliable for development:

```bash
# Start Docker Desktop first, then run:
docker run --name humanify-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=humanify -p 5432:5432 -d postgres:15-alpine

# Update .env:
DATABASE_URL="postgresql://postgres:password@localhost:5432/humanify?schema=public"

# Run migrations:
npx prisma db push
```

## Quick Test
After changing DATABASE_URL, test it:

```bash
npx prisma db push
npm run dev
```

## Current Status
- ✅ Prisma schema is valid
- ✅ Prisma client generated
- ❌ Runtime connection failing (timeouts)
- ❌ Need to fix DATABASE_URL or use different database
