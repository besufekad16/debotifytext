# Database Connection Fix

## Issue
Your Neon database at `ep-raspy-cloud-ah9nredu-pooler.c-3.us-east-1.aws.neon.tech` is unreachable.

## Quick Fix Options

### Option 1: Wake Up Neon Database (Fastest)
1. Go to https://console.neon.tech
2. Login to your account
3. Find your project "neondb"
4. Click "Wake up" if it's paused (free tier auto-pauses after inactivity)

### Option 2: Create New Free Database (Recommended)

**Using Supabase (Free Forever):**
1. Go to https://supabase.com
2. Sign up / Login
3. Create new project
4. Copy the "Connection String" (Direct connection)
5. Replace DATABASE_URL in .env

**Using Neon (New Project):**
1. Go to https://neon.tech
2. Create new project
3. Copy connection string
4. Replace DATABASE_URL in .env

### Option 3: Local PostgreSQL with Docker
Run this command in a separate terminal:
```bash
docker run --name humanify-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=humanify -p 5432:5432 -d postgres:15-alpine
```

Then update .env:
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/humanify?schema=public"
```

## After Getting New Database URL

1. Update .env with new DATABASE_URL
2. Run: `npx prisma db push`
3. Run: `npx prisma generate`
4. Restart dev server

## Current Status
- ✅ Prisma schema is valid
- ✅ Prisma client generated
- ❌ Database connection failing (server unreachable)
