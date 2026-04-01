# Krishi-Trace AI — Vercel Deployment Guide

## Prerequisites
- GitHub account
- Vercel account (sign up at vercel.com with GitHub)
- MongoDB Atlas account with a cluster set up

## Step 1: Prepare MongoDB Atlas
1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"
5. Go to Database → Connect → Connect your application
6. Copy the connection string (looks like `mongodb+srv://username:password@cluster.mongodb.net/krishi_trace`)

## Step 2: Deploy Backend to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repo: `Dhruthi9701/Krishi-Trace`
3. Configure:
   - **Project Name**: `krishi-trace-backend` (or any name)
   - **Framework Preset**: Other
   - **Root Directory**: `.` (leave as root)
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty
   - **Install Command**: `cd backend && npm install`

4. **Environment Variables** — Click "Add" for each:
   ```
   MONGO_URI = mongodb+srv://your-connection-string
   JWT_SECRET = your-random-secret-key-here
   PORT = 5000
   ```

5. Click **Deploy**
6. Wait for deployment to finish
7. **Copy the deployment URL** (e.g., `https://krishi-trace-backend.vercel.app`)
   - This is your **VITE_API_URL**

## Step 3: Update Frontend Environment Variable

Before deploying frontend, you need to set the backend URL.

**Option A: Update in repo (recommended)**
1. Edit `frontend/.env`:
   ```
   VITE_API_URL=https://your-backend-url.vercel.app/api
   ```
2. Commit and push:
   ```bash
   git add frontend/.env
   git commit -m "Update API URL for production"
   git push origin main
   ```

**Option B: Set in Vercel dashboard**
- You'll add this as an environment variable when deploying frontend (Step 4)

## Step 4: Deploy Frontend to Vercel

1. Go to [vercel.com/new](https://vercel.com/new) again
2. Import the same repo: `Dhruthi9701/Krishi-Trace`
3. Configure:
   - **Project Name**: `krishi-trace` (or any name)
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Environment Variables**:
   ```
   VITE_API_URL = https://your-backend-url.vercel.app/api
   ```
   (Use the URL from Step 2.7)

5. Click **Deploy**
6. Wait for deployment
7. Visit your frontend URL (e.g., `https://krishi-trace.vercel.app`)

## Step 5: Test

1. Go to your frontend URL
2. Try logging in with demo credentials:
   - Phone: `9000000001`
   - Password: `demo1234`
3. If login works, you're done! 🎉

## Troubleshooting

### Login Error / Network Error
- Check browser console (F12) for error details
- Verify `VITE_API_URL` is correct in frontend Vercel dashboard → Settings → Environment Variables
- Verify backend is running: visit `https://your-backend-url.vercel.app/api/health`
  - Should return: `{"status":"ok","service":"Krishi-Trace AI"}`

### MongoDB Connection Error
- Check MongoDB Atlas → Network Access allows `0.0.0.0/0`
- Verify `MONGO_URI` in backend Vercel dashboard → Settings → Environment Variables
- Check Vercel backend logs: Dashboard → Deployments → Click latest → View Function Logs

### CORS Error
- Make sure your frontend URL is added to the CORS whitelist in `backend/src/server.js`
- Redeploy backend after any CORS changes

## Auto-Redeploy on Git Push

Both frontend and backend will automatically redeploy whenever you push to the `main` branch on GitHub.

## Custom Domain (Optional)

1. Go to Vercel dashboard → Your project → Settings → Domains
2. Add your custom domain (e.g., `krishitrace.com`)
3. Follow Vercel's DNS instructions
4. Update `VITE_API_URL` in frontend if using custom domain for backend

---

## Quick Reference

**Backend URL**: `https://your-backend-url.vercel.app`
**Frontend URL**: `https://your-frontend-url.vercel.app`
**API Health Check**: `https://your-backend-url.vercel.app/api/health`

**Demo Login**:
- Farmer: `9000000001` / `demo1234`
- Distributor: `9000000002` / `demo1234`
- Retailer: `9000000003` / `demo1234`
