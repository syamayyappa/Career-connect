# CareerConnect AI - Deployment Guide

This guide explains how CareerConnect AI is hosted in production across Render and Vercel.

---

## 🌟 Active Live Deployment Links

- 🌐 **Live Web Client (Vercel)**: [https://frontend-gamma-umber-42.vercel.app](https://frontend-gamma-umber-42.vercel.app)
- ⚙️ **Live Cloud API (Render)**: [https://career-connect-t2k4.onrender.com](https://career-connect-t2k4.onrender.com)
- 🐙 **GitHub Repository**: [https://github.com/syamayyappa/Career-connect](https://github.com/syamayyappa/Career-connect)

---

## 🗄️ Step 1: Database Setup
The backend is equipped with dual database support:
- **Zero-config auto-fallback**: If `MONGO_URI` is not supplied, it launches an embedded in-memory MongoDB engine (`mongodb-memory-server`) and automatically runs `seed.js`, populating 21 vacancies and demo users.
- **Production MongoDB Atlas**: For permanent persistent cloud storage, set `MONGO_URI=mongodb+srv://...` in the Render environment variables.

---

## 💻 Step 2: Backend Deployment (Render)

1. **Sign Up**: Sign up on [Render](https://render.com) using your GitHub account.
2. **Create Web Service**:
   - Click "New +" -> "Web Service".
   - Select your CareerConnect AI GitHub repository (`syamayyappa/Career-connect`).
3. **Configure Settings**:
   - **Name**: `career-connect`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free
4. **Environment Variables (Optional)**:
   - `JWT_SECRET` = (Optional, pre-configured fallback ensures authentication works automatically)
   - `NODE_ENV` = `production`
5. **Live URL**: `https://career-connect-t2k4.onrender.com`

---

## 🌐 Step 3: Frontend Deployment (Vercel)

1. **Sign Up**: Log in to [Vercel](https://vercel.com) using your GitHub account.
2. **Import Project**:
   - Click "Add New" -> "Project".
   - Import your CareerConnect AI GitHub repository.
3. **Configure Framework & Root**:
   - **Framework Preset**: `Vite` (automatically detected)
   - **Root Directory**: Select `frontend`.
4. **Environment Variables**:
   - The frontend's `api.js` has dynamic hostname detection: in production, it routes requests to `https://career-connect-t2k4.onrender.com/api` automatically, and on localhost it talks to `http://localhost:5000/api`.
   - Optionally set `VITE_API_URL` = `https://career-connect-t2k4.onrender.com/api`.
5. **Live URL**: `https://frontend-gamma-umber-42.vercel.app`

---

## ⚠️ Troubleshooting CORS & Production Issues

### 1. CORS Configuration
In your backend `server.js`, you have configured `cors` to allow requests:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
```
If you want to secure your backend in production, add `FRONTEND_URL = https://careerconnect-ai.vercel.app` to your Render environment variables.

### 2. Render Free Tier Spin-down
On the free tier, Render automatically spins down your backend container if there is no traffic for 15 minutes. When a user visits your Vercel site after a break, the first request might take 45-60 seconds to wake up the server. This is normal for free hosting.

### 3. File Uploads in Production
Because Render's free tier uses ephemeral disk storage, any resume files uploaded to `backend/uploads` will be wiped whenever Render restarts the server container.
- *Recommended Production Fix*: Integrate Cloudinary or AWS S3 for file uploads. For a college project presentation, Render's local uploads work well for demoing live uploads.
