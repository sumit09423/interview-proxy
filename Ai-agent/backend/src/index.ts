import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { KeywordsController } from './controllers/keywords.controller';

// Load .env from root directory (parent of backend/)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app: Express = express();
const PORT = process.env.BACKEND_PORT || 3001;

function isSerpConfigured(): boolean {
  const url = process.env.SERP_API_URL || '';
  const key = process.env.SERP_API_KEY;
  if (url.includes('semust.com')) {
    const user = process.env.SERP_API_USER || key;
    const pass = process.env.SERP_API_PASSWORD || key;
    return !!(user && pass);
  }
  return !!key;
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    config: {
      azureConfigured: !!(process.env.AZURE_AI_FOUNDRY_ENDPOINT && process.env.AZURE_AI_FOUNDRY_API_KEY),
      serpConfigured: isSerpConfigured()
    }
  });
});

// Initialize controller lazily (only when needed)
let keywordsController: KeywordsController | null = null;

function getKeywordsController(): KeywordsController {
  if (!keywordsController) {
    keywordsController = new KeywordsController();
  }
  return keywordsController;
}

// API routes
app.post('/api/generate-keywords', (req, res) => {
  getKeywordsController().generateKeywords(req, res);
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`🔑 API endpoint: http://localhost:${PORT}/api/generate-keywords`);
  console.log('');
  console.log('📋 Configuration Status:');
  console.log(`   Azure AI Foundry: ${process.env.AZURE_AI_FOUNDRY_ENDPOINT && process.env.AZURE_AI_FOUNDRY_API_KEY ? '✅ Configured' : '❌ Not configured'}`);
  console.log(`   SERP API: ${isSerpConfigured() ? '✅ Configured' : '⚠️  Not configured (will use fallback)'}`);
  console.log('');
  if (!process.env.AZURE_AI_FOUNDRY_ENDPOINT || !process.env.AZURE_AI_FOUNDRY_API_KEY) {
    console.log('⚠️  Warning: Azure AI Foundry credentials not configured.');
    console.log('   Set AZURE_AI_FOUNDRY_ENDPOINT and AZURE_AI_FOUNDRY_API_KEY in your .env file.');
    console.log('   The server will start but keyword generation will fail until configured.');
    console.log('');
  }
});
