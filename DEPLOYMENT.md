# Deployment Guide

## Architecture

```
GitHub
      │
      ▼
GitHub Actions
      │
 ┌────┴─────┐
 ▼          ▼
Vercel   Railway
  │          │
  ▼          ▼
Next.js   FastAPI
             │
      ┌──────┴───────┐
      ▼              ▼
 PostgreSQL       Redis
      │
      ▼
 Gemini API
```

## Prerequisites

- Node.js 20+
- Python 3.11+
- GitHub account
- Vercel account
- Railway account
- Neon account (PostgreSQL)
- Upstash account (Redis)

---

## 1. Local Setup

### Clone and install

```bash
git clone https://github.com/Nadir-23/QuantumMathResearchGPT.git
cd QuantumMathResearchGPT

# Backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

### Environment variables

```bash
cp .env.example .env
# Edit .env with your API keys

cd frontend
cp .env.local.example .env.local
# Edit .env.local
```

### Run locally

```bash
# Terminal 1 - Backend
uvicorn app.main:app --reload --port 8000

# Terminal 2 - Frontend
cd frontend && npm run dev
```

---

## 2. Vercel Deployment (Frontend)

### Steps

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import repository
4. Set root directory to `frontend`
5. Framework: Next.js
6. Add environment variables:
   - `NEXT_PUBLIC_API_URL` = your Railway backend URL

### GitHub Secrets

Set in repository Settings > Secrets:
- `VERCEL_TOKEN` - from Vercel account settings
- `VERCEL_ORG_ID` - from Vercel project settings
- `VERCEL_PROJECT_ID` - from Vercel project settings

---

## 3. Railway Deployment (Backend)

### Steps

1. Go to [railway.com](https://railway.com)
2. New Project > Deploy from GitHub
3. Select repository
4. Add environment variables (see below)
5. Railway auto-detects Dockerfile

### GitHub Secrets

- `RAILWAY_TOKEN` - from Railway account settings

---

## 4. PostgreSQL Setup (Neon)

1. Create account at [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string
4. Add to Railway environment:
   ```
   DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
   ```

---

## 5. Redis Setup (Upstash)

1. Create account at [upstash.com](https://upstash.com)
2. Create new Redis database
3. Copy connection string
4. Add to Railway environment:
   ```
   REDIS_URL=rediss://default:password@host:6379
   ```

---

## 6. Environment Variables

### Backend (Railway)

| Variable | Description | Example |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Google Gemini API key | `AIza...` |
| `GEMINI_MODEL` | Gemini model name | `gemini-2.5-flash` |
| `DATABASE_URL` | PostgreSQL connection | `postgresql://...` |
| `REDIS_URL` | Redis connection | `rediss://...` |
| `SECRET_KEY` | App secret key | Random string |
| `ENVIRONMENT` | `production` | `production` |
| `CORS_ORIGINS` | Allowed origins | `https://app.vercel.app` |

### Frontend (Vercel)

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://app.up.railway.app` |
| `NEXT_PUBLIC_APP_NAME` | App name | `QuantumMathResearchGPT` |

---

## 7. GitHub Actions Secrets

Go to repository Settings > Secrets and variables > Actions:

| Secret | Description |
|--------|-------------|
| `VERCEL_TOKEN` | Vercel deploy token |
| `VERCEL_ORG_ID` | Vercel org ID |
| `VERCEL_PROJECT_ID` | Vercel project ID |
| `RAILWAY_TOKEN` | Railway deploy token |

---

## 8. Troubleshooting

### Build fails on Railway

- Check Python version is 3.11
- Verify all dependencies in requirements.txt
- Check build logs in Railway dashboard

### Frontend can't connect to backend

- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check CORS_ORIGINS includes your Vercel domain
- Ensure Railway service is running

### Database connection refused

- Verify `DATABASE_URL` format
- Check Neon project is active
- Ensure SSL mode is required

---

## 9. Monitoring

- **Vercel**: Analytics dashboard built-in
- **Railway**: Metrics and logs in dashboard
- **Neon**: Query performance monitoring
- **Upstash**: Real-time metrics

---

## 10. Backup Strategy

- **Database**: Neon provides automatic backups
- **Redis**: Upstash provides automatic backups
- **Code**: GitHub provides version control
- **Secrets**: Store in password manager

---

## 11. Rollback

```bash
# Vercel
vercel rollback

# Railway
railway rollback
```

---

## 12. Custom Domain

### Vercel
1. Go to Project Settings > Domains
2. Add your domain
3. Configure DNS

### Railway
1. Go to Settings > Networking
2. Generate domain
3. Or add custom domain
