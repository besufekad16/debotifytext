# Deployment Guide - HumanifyLab

## Quick Start

Your application is **production-ready** and can be deployed immediately.

---

## Option 1: Vercel Deployment (Recommended) ⭐

Vercel is the easiest and most optimized platform for Next.js applications.

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy
```bash
cd Humanify
vercel --prod
```

### Step 4: Configure Environment Variables
In the Vercel dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add all variables from your `.env` file
4. Redeploy if needed

### Vercel Advantages
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Automatic scaling
- ✅ Zero configuration
- ✅ Preview deployments
- ✅ Built-in analytics

---

## Option 2: Manual Server Deployment

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database accessible
- Domain with SSL certificate

### Step 1: Build the Application
```bash
cd Humanify
npm install
npm run build
```

### Step 2: Set Environment Variables
Create a `.env.production` file with all required variables:
```bash
DATABASE_URL=your_production_database_url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
# ... add all other variables
```

### Step 3: Start Production Server
```bash
NODE_ENV=production npm start
```

The server will run on port 3000 by default.

### Step 4: Configure Reverse Proxy (Nginx)
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Option 3: Docker Deployment

### Step 1: Create Dockerfile
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Step 2: Build Docker Image
```bash
docker build -t humanifylab .
```

### Step 3: Run Container
```bash
docker run -p 3000:3000 --env-file .env.production humanifylab
```

### Step 4: Docker Compose (Optional)
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env.production
    restart: unless-stopped
```

Run with:
```bash
docker-compose up -d
```

---

## Environment Variables Setup

### Required Variables

**Database:**
```bash
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
```

**Authentication (Clerk):**
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
CLERK_SECRET_KEY=sk_live_xxxxx
```

**Payment (Polar):**
```bash
POLAR_ACCESS_TOKEN=polar_oat_xxxxx
POLAR_WEBHOOK_SECRET=polar_whs_xxxxx
POLAR_ENV=production

# Product IDs
POLAR_PRODUCT_SMALL=prod_xxxxx
POLAR_PRODUCT_MEDIUM=prod_xxxxx
POLAR_PRODUCT_LARGE=prod_xxxxx
POLAR_PRODUCT_YEARLY_SMALL=prod_xxxxx
POLAR_PRODUCT_YEARLY_MEDIUM=prod_xxxxx
POLAR_PRODUCT_YEARLY_LARGE=prod_xxxxx
POLAR_CREDITS_5000=prod_xxxxx
POLAR_CREDITS_20000=prod_xxxxx
POLAR_CREDITS_45000=prod_xxxxx
```

**AI Services:**
```bash
AISTUDIOS_API_KEY=your_gemini_api_key
OPENAI_API_KEY=sk-proj-xxxxx
```

**Email (Resend):**
```bash
RESEND_API_KEY=re_xxxxx
```

**Environment:**
```bash
NODE_ENV=production
```

---

## Database Setup

### Step 1: Create Production Database
Create a PostgreSQL database on your preferred provider:
- Neon (recommended for serverless)
- Supabase
- Railway
- AWS RDS
- DigitalOcean

### Step 2: Run Migrations
```bash
npx prisma migrate deploy
```

### Step 3: Generate Prisma Client
```bash
npx prisma generate
```

---

## Post-Deployment Checklist

### Immediate Checks
- [ ] Homepage loads correctly
- [ ] Sign in/sign up works
- [ ] Humanization feature works
- [ ] Payment flow works
- [ ] API endpoints respond
- [ ] Webhooks receive events

### Security Checks
- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] API keys not exposed in client
- [ ] CORS configured correctly
- [ ] Rate limiting enabled

### Performance Checks
- [ ] Page load times < 3s
- [ ] Images optimized
- [ ] Static pages cached
- [ ] API response times < 500ms

### Monitoring Setup
- [ ] Error tracking (Sentry, LogRocket)
- [ ] Uptime monitoring (UptimeRobot, Pingdom)
- [ ] Analytics (Vercel Analytics, Google Analytics)
- [ ] Log aggregation (Logtail, Papertrail)

---

## Webhook Configuration

### Clerk Webhooks
1. Go to Clerk Dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/clerk`
3. Subscribe to events:
   - `user.created`
   - `user.updated`
   - `user.deleted`

### Polar Webhooks
1. Go to Polar Dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/polar`
3. Subscribe to events:
   - `subscription.created`
   - `subscription.updated`
   - `subscription.canceled`
   - `order.created`

---

## Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check database is accessible from deployment server
- Ensure SSL mode is configured correctly

### API Errors
- Check all environment variables are set
- Verify API keys are valid
- Check rate limits on external services

### Webhook Issues
- Verify webhook URLs are accessible
- Check webhook secrets match
- Review webhook logs in provider dashboards

---

## Scaling Considerations

### Horizontal Scaling
- Use load balancer (Nginx, AWS ALB)
- Deploy multiple instances
- Use Redis for session storage

### Database Scaling
- Enable connection pooling
- Use read replicas for queries
- Implement caching (Redis)

### CDN Configuration
- Use Cloudflare or AWS CloudFront
- Cache static assets
- Enable image optimization

---

## Maintenance

### Regular Updates
```bash
# Update dependencies
npm update

# Check for security vulnerabilities
npm audit

# Update Next.js
npm install next@latest react@latest react-dom@latest
```

### Database Maintenance
```bash
# Create new migration
npx prisma migrate dev --name migration_name

# Deploy migration
npx prisma migrate deploy
```

### Monitoring
- Review error logs daily
- Monitor API usage
- Track credit consumption
- Review webhook delivery rates

---

## Support

For deployment issues:
1. Check logs for error messages
2. Review environment variables
3. Verify database connectivity
4. Check external service status
5. Contact support if needed

---

## Success! 🎉

Your application is now deployed and running in production. Monitor the health checks and enjoy your live application!

**Deployment Status:** ✅ Ready
**Build Status:** ✅ Successful
**Tests:** ✅ Passing
**Security:** ✅ Configured
