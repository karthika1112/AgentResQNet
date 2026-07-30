# ResQNet AI - Production Deployment Guide

This guide covers the deployment strategy for the ResQNet AI platform using **Vercel** for the frontend, **Render** for the backend, and **MongoDB Atlas** for the database.

---

## 1. Database Setup (MongoDB Atlas)

1. Create an account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Deploy a new Free Tier or Dedicated Cluster.
3. In **Database Access**, create a new database user with a strong password.
4. In **Network Access**, add `0.0.0.0/0` (Allow access from anywhere) so Render can connect to it.
5. Click **Connect -> Connect your application** and copy the Connection String.
6. Replace `<password>` with your database user's password.

---

## 2. Backend Deployment (Render)

1. Create an account at [Render](https://render.com).
2. Create a **New Web Service** and connect your GitHub repository.
3. Configure the service:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Expand **Advanced** and add Environment Variables (copy from `backend/.env.production`):
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `MONGODB_URI`: *(Paste your Atlas Connection String here)*
   - `JWT_SECRET`: *(Generate a strong secure hex string)*
5. Click **Create Web Service**. 
6. Once deployed, copy your Render URL (e.g., `https://resqnet-api.onrender.com`).

---

## 3. Frontend Deployment (Vercel)

1. Create an account at [Vercel](https://vercel.com).
2. Click **Add New Project** and import your GitHub repository.
3. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Open **Environment Variables** and add:
   - `VITE_API_URL`: *(Paste your Render backend URL appended with `/api`)*
5. Click **Deploy**.

---

## 4. Docker Deployment (Alternative Self-Hosted)

If you prefer to deploy the entire stack on an EC2 instance, DigitalOcean Droplet, or on-premise server:

1. SSH into your server.
2. Clone the repository: `git clone <your-repo-url>`
3. Navigate to the root directory.
4. Ensure Docker and Docker Compose are installed.
5. Run the orchestrator:
   ```bash
   docker-compose up -d --build
   ```
6. The Backend will be available on Port `5000`.
7. The Frontend will be available on Port `8080`.

---

## 5. CI/CD Pipeline

This project includes a `.github/workflows/deploy.yml` file.

Whenever code is pushed to the `main` branch, GitHub Actions will:
1. Provision a Node environment.
2. Run backend testing (`npm test`).
3. Build the frontend.
4. (Optional) Trigger a Render deploy webhook (if `RENDER_DEPLOY_HOOK_URL` is set in GitHub Secrets).

Vercel will automatically redeploy the frontend on every push to `main` via its native GitHub integration.
