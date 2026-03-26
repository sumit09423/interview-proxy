# Quick Setup Guide

## Fix: Server Won't Start Error

The server was failing to start because Azure AI credentials weren't configured. This has been fixed - the server will now start successfully and show configuration status.

## Step 1: Create Environment File

Create a `.env` file in the **root directory** (`/Users/sumitt/Documents/GitHub/Ai-agent/.env`) with your Azure AI Foundry credentials:

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

## Step 2: Start the Server

Now the server should start successfully:

```bash
cd backend
npm run dev
```

You should see:
```
🚀 Backend server running on http://localhost:3001
📡 Health check: http://localhost:3001/health
🔑 API endpoint: http://localhost:3001/api/generate-keywords

📋 Configuration Status:
   Azure AI Foundry: ✅ Configured (or ❌ Not configured)
   SERP API: ✅ Configured (or ⚠️  Not configured)
```

## Step 3: Test the Health Endpoint

```bash
curl http://localhost:3001/health
```

This will show you the configuration status without requiring credentials.

## Notes

- The server will start even without Azure credentials configured
- Keyword generation will fail with a clear error message if credentials are missing
- You can check configuration status via the `/health` endpoint
- The `.env` file should be in the root directory, not in `backend/`
