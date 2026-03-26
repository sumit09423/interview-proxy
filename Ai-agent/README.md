# AI Agent Keyword Generator

A multi-agent AI system that generates top-ranked SEO keywords from product metadata using Azure AI Foundry, Datamuse API, and SERP API.

## Overview

This system uses three specialized AI agents working together:

1. **Enrichment Agent**: Generates related keywords using Datamuse API and Azure AI Foundry LLM
2. **Validation Agent**: Filters and validates keywords for relevance and policy compliance
3. **Ranking Agent**: Ranks keywords by search popularity and relevance scores

## Architecture

```
Frontend (Next.js 15) → Backend API (Express) → Agent Orchestrator
                                                      ↓
                                    ┌────────────────┼────────────────┐
                                    ↓                ↓                ↓
                            Enrichment Agent  Validation Agent  Ranking Agent
                                    ↓                ↓                ↓
                            Datamuse API      Azure AI Foundry  SERP API
```

## Technology Stack

### Frontend
- **Next.js 15** with App Router
- **React 19**
- **TypeScript 5.x**
- **Tailwind CSS**

### Backend
- **Node.js 20+**
- **TypeScript 5.x**
- **Express 4.x**
- **Azure AI Foundry SDK** (`@azure/ai-projects` v2.0.0-beta.4)
- **Azure Identity SDK** (`@azure/identity` v4.0.0)

### External APIs
- **Datamuse API** v1.1 (keyword enrichment)
- **SERP API** (keyword ranking)

## Prerequisites

- Node.js 20+ installed
- Azure AI Foundry account with API key
- SERP API key (optional, system will fallback to relevance-only ranking)
- npm or yarn package manager

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory (copy from `.env.example`):

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

### 3. Build Backend

```bash
cd backend
npm run build
```

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Usage

1. Open http://localhost:3000 in your browser
2. Enter a product title and description
3. Click "Generate Keywords"
4. View the top 20 ranked keywords with scores and metadata

## API Documentation

### POST `/api/generate-keywords`

Generate ranked keywords from product metadata.

**Request Body:**
```json
{
  "title": "Wireless Noise Cancelling Headphones",
  "description": "Bluetooth over-ear headphones with deep bass and long battery life"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "keywords": [
      {
        "keyword": "bluetooth headphones",
        "rank": 1,
        "score": 95.5,
        "relevanceScore": 98,
        "searchVolume": 50000
      },
      ...
    ],
    "metadata": {
      "totalGenerated": 87,
      "processingTime": 3450,
      "enrichmentCount": 87,
      "validationCount": 52,
      "rankingCount": 20
    }
  }
}
```

### GET `/health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-03-12T21:51:00.000Z"
}
```

## Project Structure

```
Ai-agent/
├── backend/
│   ├── src/
│   │   ├── agents/          # AI agents (enrichment, validation, ranking)
│   │   ├── services/        # External API integrations
│   │   ├── orchestrator/    # Multi-agent workflow coordinator
│   │   ├── controllers/     # API route handlers
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Utility functions
│   │   └── index.ts         # Express server entry point
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # React components
│   ├── package.json
│   └── next.config.ts
│
├── .env.example             # Environment variables template
└── README.md
```

## Development

### Backend Development

```bash
cd backend
npm run dev          # Run with hot reload
npm run build        # Build TypeScript
npm run start        # Run production build
npm run type-check   # Type check without building
```

### Frontend Development

```bash
cd frontend
npm run dev          # Run development server
npm run build        # Build for production
npm run start        # Run production server
npm run lint         # Run ESLint
```

## Error Handling

The system includes comprehensive error handling:

- **API Failures**: Automatic retry with exponential backoff
- **SERP API Unavailable**: Falls back to relevance-only ranking
- **Validation Errors**: Returns descriptive error messages
- **Network Issues**: Graceful degradation with fallback methods

## Performance Considerations

- Datamuse API requests are batched to avoid rate limiting
- SERP API requests include delays between batches
- LLM calls use optimized prompts and temperature settings
- Response caching can be added for identical inputs

## Testing

To test the API directly:

```bash
curl -X POST http://localhost:3001/api/generate-keywords \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Wireless Noise Cancelling Headphones",
    "description": "Bluetooth over-ear headphones with deep bass and long battery life"
  }'
```

## Troubleshooting

### Backend won't start
- Check that all environment variables are set
- Verify Azure AI Foundry credentials are correct
- Ensure port 3001 is not in use

### Frontend can't connect to backend
- Verify `NEXT_PUBLIC_API_URL` matches backend URL
- Check CORS settings in backend
- Ensure backend is running

### Keywords not generating
- Check Azure AI Foundry API key and endpoint
- Verify deployment name matches your Azure setup
- Check browser console for errors

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

For issues and questions, please open an issue on the repository.
