# AI Agent Keyword Generator - Complete Setup Guide

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Project Structure](#project-structure)
4. [Step-by-Step Setup](#step-by-step-setup)
5. [Configuration](#configuration)
6. [Running the Application](#running-the-application)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)
9. [Development Workflow](#development-workflow)
10. [Production Deployment](#production-deployment)

---

## Overview

This guide will walk you through setting up the AI Agent Keyword Generator project from scratch. The project consists of a Next.js frontend and an Express backend, both written in TypeScript, that work together to generate SEO keywords using multiple AI agents.

**Estimated Setup Time**: 15-20 minutes

---

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

1. **Node.js** (version 20 or higher)
   - Download from: https://nodejs.org/
   - Verify installation:
     ```bash
     node --version  # Should show v20.x.x or higher
     npm --version   # Should show 10.x.x or higher
     ```

2. **npm** (comes with Node.js) or **yarn**
   - npm is included with Node.js
   - Verify: `npm --version`

3. **Git** (optional, for cloning repository)
   - Download from: https://git-scm.com/
   - Verify: `git --version`

### Required Accounts & API Keys

1. **Azure AI Foundry Account**
   - Sign up at: https://azure.microsoft.com/en-us/products/ai-services/openai-service
   - You'll need:
     - Endpoint URL (e.g., `https://your-foundry-instance.openai.azure.com`)
     - API Key
     - Deployment Name (e.g., `gpt-4`)

2. **SERP API Key** (Optional but recommended)
   - Sign up at: https://serpapi.com/ or similar SERP API provider
   - Provides search volume and competition data
   - System will work without it (uses fallback ranking)

---

## Project Structure

Understanding the project structure will help you navigate the codebase:

```
Ai-agent/
├── backend/                    # Express backend server
│   ├── src/
│   │   ├── agents/            # AI agent implementations
│   │   │   ├── enrichment-agent.ts
│   │   │   ├── validation-agent.ts
│   │   │   └── ranking-agent.ts
│   │   ├── controllers/       # API route handlers
│   │   │   └── keywords.controller.ts
│   │   ├── orchestrator/      # Multi-agent coordinator
│   │   │   └── agent-orchestrator.ts
│   │   ├── services/          # External API integrations
│   │   │   ├── azure-ai.service.ts
│   │   │   ├── datamuse.service.ts
│   │   │   └── serp.service.ts
│   │   ├── types/             # TypeScript type definitions
│   │   │   └── index.ts
│   │   ├── utils/             # Utility functions
│   │   │   └── validation.ts
│   │   └── index.ts           # Express server entry point
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # Next.js frontend application
│   ├── app/                   # Next.js App Router pages
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── types.ts
│   ├── components/            # React components
│   │   ├── Chatbot.tsx
│   │   ├── KeywordList.tsx
│   │   └── ProductForm.tsx
│   ├── package.json
│   └── next.config.ts
│
├── .env                        # Environment variables (create this)
├── .env.example               # Environment variables template
├── README.md                  # Project documentation
├── SETUP.md                   # Quick setup guide
├── SETUP_GUIDE.md            # This file
└── PROJECT_OVERVIEW.md       # Project architecture overview
```

---

## Step-by-Step Setup

### Step 1: Clone or Download the Project

If you have the project in a Git repository:
```bash
git clone <repository-url>
cd Ai-agent
```

If you have the project files locally, navigate to the project directory:
```bash
cd /path/to/Ai-agent
```

### Step 2: Install Backend Dependencies

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

**What this does**: Installs all backend dependencies including Express, TypeScript, Axios, and other required packages.

**Expected output**: You should see a list of installed packages and a `node_modules` folder created.

**Troubleshooting**:
- If you see permission errors, try: `sudo npm install` (macOS/Linux) or run terminal as administrator (Windows)
- If installation fails, try: `npm cache clean --force` then `npm install` again

### Step 3: Install Frontend Dependencies

Navigate to the frontend directory and install dependencies:

```bash
cd ../frontend
npm install
```

**What this does**: Installs all frontend dependencies including Next.js, React, TypeScript, Tailwind CSS, and other required packages.

**Expected output**: You should see a list of installed packages and a `node_modules` folder created.

### Step 4: Create Environment Variables File

Navigate back to the root directory and create the `.env` file:

```bash
cd ..
cp .env.example .env
```

Or create a new `.env` file manually in the root directory with the following content:

```bash
# Azure AI Foundry Configuration
AZURE_AI_FOUNDRY_ENDPOINT=https://your-foundry-instance.openai.azure.com
AZURE_AI_FOUNDRY_API_KEY=your-api-key-here
AZURE_AI_FOUNDRY_DEPLOYMENT_NAME=gpt-4

# SERP API Configuration (optional)
SERP_API_KEY=your-serp-api-key-here
SERP_API_URL=https://data.semust.com/v1/serp

# Backend Configuration
BACKEND_PORT=3001
NODE_ENV=development

# Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Important Notes**:
- The `.env` file should be in the **root directory** (same level as `backend/` and `frontend/` folders)
- Never commit the `.env` file to version control (it should be in `.gitignore`)
- Replace placeholder values with your actual API keys

### Step 5: Configure Azure AI Foundry

1. **Get your Azure AI Foundry credentials**:
   - Log in to Azure Portal
   - Navigate to your Azure AI Foundry resource
   - Go to "Keys and Endpoint" section
   - Copy your endpoint URL and API key

2. **Update `.env` file**:
   ```bash
   AZURE_AI_FOUNDRY_ENDPOINT=https://your-actual-endpoint.openai.azure.com
   AZURE_AI_FOUNDRY_API_KEY=your-actual-api-key
   AZURE_AI_FOUNDRY_DEPLOYMENT_NAME=gpt-4  # Or your deployment name
   ```

3. **Verify endpoint format**:
   - Use the base endpoint (without `/openai/v1`)
   - Example: `https://your-foundry.openai.azure.com`
   - The code will automatically append `/openai/v1`

### Step 6: Configure SERP API (Optional)

1. **Get your SERP API key**:
   - Sign up for a SERP API service (e.g., SerpAPI, DataForSEO)
   - Get your API key from the dashboard

2. **Update `.env` file**:
   ```bash
   SERP_API_KEY=your-actual-serp-api-key
   SERP_API_URL=https://data.semust.com/v1/serp  # Or your provider's URL
   ```

**Note**: The system will work without SERP API, but ranking will be based only on relevance scores (no search volume data).

### Step 7: Build Backend (Optional but Recommended)

Build the TypeScript backend to check for compilation errors:

```bash
cd backend
npm run build
```

**What this does**: Compiles TypeScript to JavaScript in the `dist/` folder.

**Expected output**: You should see compiled JavaScript files in `backend/dist/`.

**If you see errors**: Fix TypeScript errors before proceeding.

---

## Configuration

### Environment Variables Explained

#### Azure AI Foundry Configuration

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `AZURE_AI_FOUNDRY_ENDPOINT` | Base URL of your Azure AI Foundry instance | `https://your-foundry.openai.azure.com` | Yes |
| `AZURE_AI_FOUNDRY_API_KEY` | API key for authentication | `abc123...` | Yes |
| `AZURE_AI_FOUNDRY_DEPLOYMENT_NAME` | Name of your deployment | `gpt-4` | Yes |

**Azure-side performance (faster keyword generation):**

- **Use a faster model**: Deploy a smaller/faster model (e.g. `gpt-4o-mini`, `o1-mini`, or your region’s “fast” offering) in Azure AI Studio and set `AZURE_AI_FOUNDRY_DEPLOYMENT_NAME` to that deployment. Smaller models give much lower latency for the same prompts.
- **Region**: Create your Azure OpenAI resource in a region close to where the app runs to reduce network latency.
- **Quota**: Ensure the deployment has enough quota so requests are not queued.

#### SERP API Configuration

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `SERP_API_KEY` | API key for SERP service | `xyz789...` | No |
| `SERP_API_URL` | Base URL of SERP API | `https://data.semust.com/v1/serp` | No |

#### Backend Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `BACKEND_PORT` | Port for Express server | `3001` | No |
| `NODE_ENV` | Environment mode | `development` | No |

#### Frontend Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3001` | No |

### Port Configuration

- **Backend**: Runs on port 3001 (configurable via `BACKEND_PORT`)
- **Frontend**: Runs on port 3000 (Next.js default)

If these ports are in use, you can:
1. Change `BACKEND_PORT` in `.env`
2. Update `NEXT_PUBLIC_API_URL` to match
3. For frontend, use: `npm run dev -- -p 3002` (or any port)

---

## Running the Application

### Development Mode

You need to run both backend and frontend servers simultaneously.

#### Terminal 1: Backend Server

```bash
cd backend
npm run dev
```

**Expected output**:
```
🚀 Backend server running on http://localhost:3001
📡 Health check: http://localhost:3001/health
🔑 API endpoint: http://localhost:3001/api/generate-keywords

📋 Configuration Status:
   Azure AI Foundry: ✅ Configured
   SERP API: ✅ Configured (or ⚠️  Not configured)
```

**What this does**: Starts the Express server with hot reload (automatically restarts on file changes).

#### Terminal 2: Frontend Server

```bash
cd frontend
npm run dev
```

**Expected output**:
```
  ▲ Next.js 15.x.x
  - Local:        http://localhost:3000
  - ready started server on 0.0.0.0:3000
```

**What this does**: Starts the Next.js development server with hot reload.

### Accessing the Application

1. **Open your browser** and navigate to: `http://localhost:3000`
2. You should see the AI Agent Keyword Generator interface
3. Enter a product title and description
4. Click "Generate Keywords"
5. View the results!

### Production Mode

For production builds:

**Backend**:
```bash
cd backend
npm run build
npm start
```

**Frontend**:
```bash
cd frontend
npm run build
npm start
```

---

## Testing

### Test Backend Health Endpoint

Check if the backend is running and configured correctly:

```bash
curl http://localhost:3001/health
```

**Expected response**:
```json
{
  "status": "ok",
  "timestamp": "2026-03-13T12:00:00.000Z",
  "config": {
    "azureConfigured": true,
    "serpConfigured": true
  }
}
```

### Test Keyword Generation API

Test the keyword generation endpoint directly:

```bash
curl -X POST http://localhost:3001/api/generate-keywords \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Wireless Noise Cancelling Headphones",
    "description": "Bluetooth over-ear headphones with deep bass and long battery life"
  }'
```

**Expected response**: JSON with keywords array and metadata.

### Test Frontend

1. Open `http://localhost:3000` in your browser
2. Open browser developer tools (F12)
3. Check the Console tab for any errors
4. Check the Network tab to see API calls

---

## Troubleshooting

### Common Issues and Solutions

#### 1. Backend Won't Start

**Error**: `Port 3001 is already in use`

**Solution**:
```bash
# Find process using port 3001
lsof -i :3001  # macOS/Linux
netstat -ano | findstr :3001  # Windows

# Kill the process or change port in .env
```

**Error**: `Azure AI Foundry credentials not configured`

**Solution**:
- Check that `.env` file exists in root directory
- Verify environment variable names are correct
- Ensure no extra spaces or quotes around values
- Restart the backend server after changing `.env`

#### 2. Frontend Can't Connect to Backend

**Error**: `Failed to fetch` or `Network error`

**Solutions**:
1. **Verify backend is running**: Check `http://localhost:3001/health`
2. **Check CORS**: Backend should have CORS enabled (it does by default)
3. **Verify API URL**: Check `NEXT_PUBLIC_API_URL` in `.env` matches backend URL
4. **Restart frontend**: After changing `.env`, restart the frontend server

#### 3. Keywords Not Generating

**Error**: `Failed to generate keywords`

**Solutions**:
1. **Check Azure AI credentials**:
   ```bash
   curl http://localhost:3001/health
   # Should show azureConfigured: true
   ```

2. **Verify endpoint format**:
   - Should be: `https://your-foundry.openai.azure.com`
   - Should NOT include `/openai/v1` at the end

3. **Check API key validity**: Test your Azure AI credentials in Azure Portal

4. **Check deployment name**: Ensure `AZURE_AI_FOUNDRY_DEPLOYMENT_NAME` matches your deployment

5. **Check browser console**: Look for detailed error messages

6. **401 (Invalid key or wrong endpoint)**: Use the API key and endpoint from the same Azure resource. In Azure Portal → your resource → Keys and Endpoint, copy Key 1/2 and Endpoint; update `.env` and restart the backend.

7. **400 (Unsupported parameter `max_tokens`)**: Newer Azure models expect `max_completion_tokens`. The backend uses `max_completion_tokens`; if you see this error, ensure you’re on the latest code.

8. **SERP 401 (Semust “Missing or invalid authentication credentials”)**: The Semust API at `data.semust.com` uses headers `SEMUST-API-USER` and `SEMUST-API-PASSWORD`, not Bearer. The app uses `SERP_API_KEY` for both if `SERP_API_USER` / `SERP_API_PASSWORD` are not set. If you still get 401, set `SERP_API_USER` and `SERP_API_PASSWORD` from your Semust dashboard (Keys/Credentials) in `.env`.

#### 4. TypeScript Compilation Errors

**Error**: Type errors during build

**Solutions**:
1. **Check TypeScript version**: Ensure compatible versions
2. **Clear build cache**: Delete `dist/` folder and rebuild
3. **Check tsconfig.json**: Verify configuration is correct

#### 5. Module Not Found Errors

**Error**: `Cannot find module '...'`

**Solutions**:
1. **Reinstall dependencies**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check Node.js version**: Ensure Node.js 20+ is installed

#### 6. Environment Variables Not Loading

**Error**: Variables are `undefined`

**Solutions**:
1. **Verify `.env` location**: Must be in root directory
2. **Check variable names**: Must match exactly (case-sensitive)
3. **Restart servers**: Environment variables load at startup
4. **Check for typos**: No spaces around `=` sign

### Getting Help

If you encounter issues not covered here:

1. **Check logs**: Look at terminal output for both backend and frontend
2. **Check browser console**: Open developer tools (F12) and check Console tab
3. **Verify configuration**: Use `/health` endpoint to check configuration status
4. **Review documentation**: Check `README.md` and `PROJECT_OVERVIEW.md`

---

## Development Workflow

### Making Changes

1. **Backend Changes**:
   - Edit TypeScript files in `backend/src/`
   - Server auto-reloads (thanks to `ts-node-dev`)
   - Check terminal for compilation errors

2. **Frontend Changes**:
   - Edit React components in `frontend/components/` or pages in `frontend/app/`
   - Browser auto-refreshes (thanks to Next.js hot reload)
   - Check browser console for errors

### Code Structure Guidelines

- **Backend**: Follow the existing structure (agents, services, controllers)
- **Frontend**: Use Next.js App Router patterns
- **TypeScript**: Maintain type safety, avoid `any` types
- **Error Handling**: Always handle errors gracefully

### Testing Changes

1. **Backend**: Test API endpoints with `curl` or Postman
2. **Frontend**: Test in browser, check console for errors
3. **Integration**: Test full flow from frontend to backend

---

## Production Deployment

### Building for Production

**Backend**:
```bash
cd backend
npm run build
# Output in backend/dist/
```

**Frontend**:
```bash
cd frontend
npm run build
# Output optimized for production
```

### Environment Variables in Production

1. **Set environment variables** on your hosting platform:
   - Azure App Service: Use Configuration → Application Settings
   - Heroku: Use `heroku config:set KEY=value`
   - Vercel: Use Project Settings → Environment Variables
   - Docker: Use `-e` flags or `.env` file

2. **Update `NEXT_PUBLIC_API_URL`** to your production backend URL

### Deployment Checklist

- [ ] All environment variables configured
- [ ] Backend built successfully (`npm run build`)
- [ ] Frontend built successfully (`npm run build`)
- [ ] Health endpoint returns `ok` status
- [ ] API endpoint responds correctly
- [ ] Frontend can connect to backend
- [ ] CORS configured for production domain
- [ ] Error handling tested
- [ ] Logging configured

---

## Additional Resources

### Documentation Files

- **README.md**: Quick start and overview
- **PROJECT_OVERVIEW.md**: Detailed architecture and design
- **SETUP.md**: Quick setup reference
- **SETUP_GUIDE.md**: This comprehensive guide

### External Resources

- **Next.js Documentation**: https://nextjs.org/docs
- **Express Documentation**: https://expressjs.com/
- **TypeScript Documentation**: https://www.typescriptlang.org/docs/
- **Azure AI Foundry**: https://azure.microsoft.com/en-us/products/ai-services/openai-service

---

## Quick Reference

### Common Commands

```bash
# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Run development servers
cd backend && npm run dev        # Terminal 1
cd frontend && npm run dev       # Terminal 2

# Build for production
cd backend && npm run build
cd frontend && npm run build

# Test backend health
curl http://localhost:3001/health

# Test API endpoint
curl -X POST http://localhost:3001/api/generate-keywords \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","description":"Test description"}'
```

### Important URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health
- **API Endpoint**: http://localhost:3001/api/generate-keywords

---

## Conclusion

You should now have the AI Agent Keyword Generator fully set up and running! 

**Next Steps**:
1. Test the application with sample product data
2. Explore the codebase using `PROJECT_OVERVIEW.md`
3. Customize agents or add new features
4. Deploy to production when ready

If you encounter any issues, refer to the Troubleshooting section or check the project documentation.

**Happy coding! 🚀**
