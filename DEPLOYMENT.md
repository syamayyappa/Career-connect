# CareerConnect AI - Deployment Guide

This guide explains how to host your database, backend server, and frontend web client in a production environment.

---

## 🗄️ Step 1: Database Deployment (MongoDB Atlas)

1. **Create an Account**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account.
2. **Deploy Shared Cluster**: Click "Build a Database" and select the **M0 FREE** tier cluster. Pick a cloud provider (e.g., AWS) and region nearest to your users.
3. **Configure Database Access**:
   - Create a database user with password authentication (save username/password).
4. **Configure Network Access**:
   - Go to "Network Access" -> "Add IP Address".
   - Select "Allow Access From Anywhere" (`0.0.0.0/0`). This is necessary because hosting services like Render do not have static IP addresses.
5. **Retrieve Connection String**:
   - Go to "Database" -> "Connect" -> "Drivers" (Node.js).
   - Copy the connection string. It will look like:
     `mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/careerconnect?retryWrites=true&w=majority`
   - Replace `<username>` and `<password>` with your database credentials.

---

## 💻 Step 2: Backend Deployment (Render)

1. **Sign Up**: Sign up on [Render](https://render.com) using your GitHub account.
2. **Create Web Service**:
   - Click "New +" -> "Web Service".
   - Select your CareerConnect AI GitHub repository.
3. **Configure Settings**:
   - **Name**: `careerconnect-ai-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Select the free tier.
4. **Environment Variables**:
   Under the "Environment" tab, click "Add Environment Variable":
   - `PORT` = `5000`
   - `MONGO_URI` = `mongodb+srv://...` (your Atlas connection string)
   - `JWT_SECRET` = `your_secure_random_production_secret`
   - `NODE_ENV` = `production`
5. **Deploy**: Click "Deploy Web Service". Render will compile and deploy your backend. It will provide a URL like `https://careerconnect-ai-backend.onrender.com`.

---

## 🌐 Step 3: Frontend Deployment (Vercel)

1. **Sign Up**: Log in to [Vercel](https://vercel.com) using your GitHub account.
2. **Import Project**:
   - Click "Add New" -> "Project".
   - Import your CareerConnect AI GitHub repository.
3. **Configure Framework & Root**:
   - **Framework Preset**: `Vite` (automatically detected)
   - **Root Directory**: Click Edit and select `frontend`.
4. **Environment Variables**:
   Add a single environment variable:
   - `VITE_API_URL` = `https://careerconnect-ai-backend.onrender.com/api` (your deployed Render API base URL)
5. **Deploy**: Click "Deploy". Vercel will install dependencies, compile assets, and publish your client. It will provide a production URL like `https://careerconnect-ai.vercel.app`.

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
