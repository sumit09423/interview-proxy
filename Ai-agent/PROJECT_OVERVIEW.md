# AI Agent Keyword Generator - Project Overview

## Table of Contents
1. [Introduction](#introduction)
2. [Project Purpose](#project-purpose)
3. [Architecture Overview](#architecture-overview)
4. [Technology Stack](#technology-stack)
5. [System Flow](#system-flow)
6. [Component Details](#component-details)
7. [Design Decisions](#design-decisions)
8. [How It Works](#how-it-works)
9. [Explaining to Others](#explaining-to-others)

---

## Introduction

The **AI Agent Keyword Generator** is a sophisticated multi-agent AI system designed to generate, validate, and rank SEO keywords from product metadata. The system leverages three specialized AI agents working in coordination to produce high-quality, ranked keyword suggestions for e-commerce products.

---

## Project Purpose

### Problem Statement
E-commerce businesses need effective SEO keywords to improve product discoverability. Manually generating and ranking keywords is:
- Time-consuming
- Requires SEO expertise
- Difficult to scale
- Prone to missing relevant keywords

### Solution
An automated multi-agent system that:
- Generates diverse keyword variations from product information
- Validates keywords for relevance and policy compliance
- Ranks keywords by search popularity and relevance
- Provides actionable SEO insights

---

## Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js 15)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Product Form │  │ Keyword List │  │   Chatbot    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP POST
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Backend API (Express + TypeScript)             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Keywords Controller                          │   │
│  │  - Request Validation                                │   │
│  │  - Error Handling                                   │   │
│  │  - Response Formatting                              │   │
│  └──────────────────────────────────────────────────────┘   │
│                            │                                 │
│                            ▼                                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Agent Orchestrator                           │   │
│  │  - Coordinates Multi-Agent Workflow                  │   │
│  │  - Manages Retry Logic                              │   │
│  │  - Tracks Processing Metrics                        │   │
│  └──────────────────────────────────────────────────────┘   │
│         │              │              │                      │
│         ▼              ▼              ▼                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │Enrichment│  │Validation│  │ Ranking  │                  │
│  │  Agent   │  │  Agent   │  │  Agent   │                  │
│  └──────────┘  └──────────┘  └──────────┘                  │
└─────────────────────────────────────────────────────────────┘
         │              │              │
         ▼              ▼              ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Datamuse API │  │ Azure AI     │  │ SERP API     │
│              │  │ Foundry      │  │              │
└──────────────┘  └──────────────┘  └──────────────┘
```

### Architecture Principles

1. **Separation of Concerns**: Frontend, backend, and external services are clearly separated
2. **Agent-Based Design**: Each agent has a specific responsibility
3. **Orchestration Pattern**: Central orchestrator coordinates agent workflow
4. **Service Layer**: External API integrations abstracted into services
5. **Error Resilience**: Fallback mechanisms and retry logic built-in

---

## Technology Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **React 19**: UI library
- **TypeScript 5.x**: Type safety
- **Tailwind CSS**: Utility-first styling

### Backend
- **Node.js 20+**: Runtime environment
- **Express 4.x**: Web framework
- **TypeScript 5.x**: Type safety
- **Axios**: HTTP client for API calls

### External Services
- **Azure AI Foundry**: Large Language Model (GPT-4) for keyword generation and validation
- **Datamuse API**: Keyword enrichment and typo correction
- **SERP API**: Search engine ranking data (search volume, competition)

### Development Tools
- **ts-node-dev**: Development server with hot reload
- **dotenv**: Environment variable management
- **CORS**: Cross-origin resource sharing

---

## System Flow

### Complete Request Flow

```
1. User Input
   └─> User enters product title and description in frontend

2. Frontend Request
   └─> POST /api/generate-keywords
       Body: { title: "...", description: "..." }

3. Backend Controller
   └─> KeywordsController.generateKeywords()
       ├─> Validates request body
       ├─> Calls AgentOrchestrator.processWithRetry()
       └─> Returns formatted response

4. Agent Orchestrator
   └─> AgentOrchestrator.process()
       │
       ├─> STEP 1: Enrichment Agent
       │   ├─> Extracts keywords from title/description
       │   ├─> Calls Datamuse API for related keywords
       │   ├─> Calls Azure AI for context-aware keywords
       │   ├─> Corrects typos using Datamuse
       │   └─> Returns: ~80-100 keywords
       │
       ├─> STEP 2: Validation Agent
       │   ├─> Removes duplicates
       │   ├─> Filters banned words
       │   ├─> Uses Azure AI to validate relevance
       │   ├─> Applies manual filtering rules
       │   └─> Returns: ~50-70 validated keywords
       │
       └─> STEP 3: Ranking Agent
           ├─> Calculates relevance scores (Azure AI)
           ├─> Fetches SERP metrics (search volume, competition)
           ├─> Combines scores (60% relevance + 40% popularity)
           ├─> Sorts by combined score
           └─> Returns: Top 20 ranked keywords

5. Response
   └─> Returns JSON with:
       ├─> keywords: Array of top 20 ranked keywords
       └─> metadata: Processing statistics

6. Frontend Display
   └─> Renders keywords in table
       ├─> Shows rank, keyword, score, search volume
       ├─> Displays processing statistics
       └─> Provides export options (CSV, JSON)
```

### Detailed Agent Workflows

#### Enrichment Agent Workflow

```
Input: ProductMetadata { title, description }
│
├─> Extract Keywords
│   ├─> Split title/description by separators
│   ├─> Remove stop words
│   └─> Generate 2-3 word phrases (n-grams)
│
├─> Datamuse Enrichment
│   ├─> For each extracted keyword:
│   │   ├─> Find similar meaning keywords
│   │   └─> Batch processing (5 keywords at a time)
│   └─> Add to keyword pool
│
├─> Azure AI Generation
│   ├─> Build prompt with product info + existing keywords
│   ├─> Call Azure AI Foundry API
│   ├─> Parse response (one keyword per line)
│   └─> Add to keyword pool
│
├─> Typo Correction
│   ├─> For each keyword:
│   │   ├─> Check similar-sounding words
│   │   ├─> Check similar-spelling words
│   │   └─> Replace if correction found
│   └─> Batch processing with delays
│
└─> Deduplication
    └─> Return unique keywords array
```

#### Validation Agent Workflow

```
Input: Keywords[] from Enrichment Agent
│
├─> Remove Duplicates
│   └─> Normalize and deduplicate
│
├─> Filter Banned Words
│   ├─> Check against banned words list
│   ├─> Remove keywords containing banned words
│   └─> Track removed keywords
│
├─> LLM Validation (Azure AI)
│   ├─> Build validation prompt
│   ├─> Call Azure AI with JSON response format
│   ├─> Parse valid/invalid arrays
│   └─> Remove irrelevant keywords
│
├─> Manual Filtering
│   ├─> Length check (2-50 characters)
│   ├─> Remove numbers-only keywords
│   ├─> Remove too generic keywords
│   ├─> Basic relevance check
│   └─> Track removed keywords
│
└─> Return Validated Keywords
    ├─> keywords: Validated array
    └─> removed: Array of removed keywords with reasons
```

#### Ranking Agent Workflow

```
Input: Validated Keywords[] from Validation Agent
│
├─> Calculate Relevance Scores (Azure AI)
│   ├─> Build relevance scoring prompt
│   ├─> Call Azure AI with JSON response format
│   ├─> Parse keyword -> score map (0-100)
│   └─> Store relevance scores
│
├─> Fetch SERP Metrics (SERP API)
│   ├─> Batch process keywords (5 at a time)
│   ├─> For each keyword:
│   │   ├─> Get search volume
│   │   ├─> Get competition level
│   │   ├─> Get CPC (cost per click)
│   │   └─> Calculate popularity score
│   └─> Handle API failures gracefully
│
├─> Combine Scores
│   ├─> Relevance Score: 60% weight
│   ├─> Popularity Score: 40% weight
│   └─> Combined Score = (relevance × 0.6) + (popularity × 0.4)
│
├─> Sort by Combined Score
│   └─> Descending order (highest score first)
│
└─> Return Top N Keywords
    ├─> Select top 20 keywords
    ├─> Assign ranks (1-20)
    └─> Include all metadata (scores, search volume)
```

---

## Component Details

### Frontend Components

#### 1. Chatbot Component (`components/Chatbot.tsx`)
- **Purpose**: Main UI component orchestrating the keyword generation flow
- **Features**:
  - Product form integration
  - Loading progress indicator
  - Error handling with retry
  - Conversation history
  - Export functionality (CSV, JSON)
  - Processing statistics display

#### 2. ProductForm Component (`components/ProductForm.tsx`)
- **Purpose**: Form for entering product metadata
- **Features**:
  - Title input field
  - Description textarea
  - Form validation
  - Submit handler

#### 3. KeywordList Component (`components/KeywordList.tsx`)
- **Purpose**: Display generated keywords in a table
- **Features**:
  - Ranked keyword table
  - Score visualization
  - Search volume display
  - Copy to clipboard functionality

### Backend Components

#### 1. Keywords Controller (`controllers/keywords.controller.ts`)
- **Purpose**: Handle HTTP requests and responses
- **Responsibilities**:
  - Request validation
  - Error handling
  - Response formatting
  - Status code management

#### 2. Agent Orchestrator (`orchestrator/agent-orchestrator.ts`)
- **Purpose**: Coordinate multi-agent workflow
- **Responsibilities**:
  - Sequential agent execution
  - Error handling and retry logic
  - Metrics tracking
  - Result aggregation

#### 3. Enrichment Agent (`agents/enrichment-agent.ts`)
- **Purpose**: Generate diverse keywords
- **Responsibilities**:
  - Keyword extraction from text
  - Datamuse API integration
  - Azure AI keyword generation
  - Typo correction
  - Deduplication

#### 4. Validation Agent (`agents/validation-agent.ts`)
- **Purpose**: Filter and validate keywords
- **Responsibilities**:
  - Duplicate removal
  - Banned word filtering
  - LLM-based relevance validation
  - Manual filtering rules

#### 5. Ranking Agent (`agents/ranking-agent.ts`)
- **Purpose**: Rank keywords by relevance and popularity
- **Responsibilities**:
  - Relevance score calculation
  - SERP metrics fetching
  - Score combination
  - Top N selection

### Service Layer

#### 1. Azure AI Service (`services/azure-ai.service.ts`)
- **Purpose**: Interface with Azure AI Foundry
- **Capabilities**:
  - Keyword generation
  - Keyword validation
  - Relevance scoring
  - Lazy initialization
  - Error handling

#### 2. Datamuse Service (`services/datamuse.service.ts`)
- **Purpose**: Interface with Datamuse API
- **Capabilities**:
  - Similar keyword finding
  - Typo correction
  - Batch processing
  - Rate limiting handling

#### 3. SERP Service (`services/serp.service.ts`)
- **Purpose**: Interface with SERP API
- **Capabilities**:
  - Search volume fetching
  - Competition data retrieval
  - Popularity score calculation
  - Fallback mechanisms

---

## Design Decisions

### 1. Multi-Agent Architecture
**Decision**: Use three specialized agents instead of one monolithic agent.

**Rationale**:
- **Separation of Concerns**: Each agent has a clear, single responsibility
- **Maintainability**: Easier to modify or replace individual agents
- **Testability**: Each agent can be tested independently
- **Scalability**: Agents can be parallelized in the future
- **Explainability**: Clear workflow makes it easy to understand and debug

### 2. Orchestrator Pattern
**Decision**: Central orchestrator coordinates agent workflow.

**Rationale**:
- **Control Flow**: Sequential execution ensures proper data flow
- **Error Handling**: Centralized error handling and retry logic
- **Metrics**: Single point for tracking processing metrics
- **Flexibility**: Easy to modify workflow without changing agents

### 3. Service Layer Abstraction
**Decision**: Abstract external APIs into service classes.

**Rationale**:
- **Testability**: Easy to mock services for testing
- **Maintainability**: Changes to API don't affect agents
- **Reusability**: Services can be used by multiple agents
- **Error Handling**: Centralized API error handling

### 4. Fallback Mechanisms
**Decision**: Implement fallback for SERP API failures.

**Rationale**:
- **Resilience**: System continues working if SERP API fails
- **User Experience**: Users still get results (relevance-only ranking)
- **Cost**: Reduces dependency on paid API

### 5. Batch Processing
**Decision**: Process API requests in batches with delays.

**Rationale**:
- **Rate Limiting**: Prevents hitting API rate limits
- **Performance**: Balances speed and reliability
- **Cost**: Reduces API call costs

### 6. TypeScript Throughout
**Decision**: Use TypeScript for both frontend and backend.

**Rationale**:
- **Type Safety**: Catches errors at compile time
- **Developer Experience**: Better IDE support and autocomplete
- **Maintainability**: Self-documenting code with types
- **Refactoring**: Safer refactoring with type checking

---

## How It Works

### Step-by-Step Execution

1. **User Submits Product Information**
   - User enters product title and description
   - Frontend validates input
   - Sends POST request to backend

2. **Backend Receives Request**
   - Controller validates request body
   - Initializes orchestrator (if not already initialized)
   - Calls orchestrator with retry logic

3. **Enrichment Phase**
   - Extracts initial keywords from title/description
   - Calls Datamuse API for related keywords (batched)
   - Calls Azure AI for context-aware keywords
   - Corrects typos using Datamuse
   - Deduplicates keywords
   - Result: ~80-100 keywords

4. **Validation Phase**
   - Removes duplicate keywords
   - Filters banned words
   - Uses Azure AI to validate relevance
   - Applies manual filtering rules
   - Result: ~50-70 validated keywords

5. **Ranking Phase**
   - Calculates relevance scores using Azure AI
   - Fetches SERP metrics (with fallback if unavailable)
   - Combines relevance (60%) and popularity (40%) scores
   - Sorts by combined score
   - Selects top 20 keywords
   - Result: Top 20 ranked keywords

6. **Response**
   - Returns JSON with keywords and metadata
   - Includes processing statistics
   - Frontend displays results

### Error Handling

- **API Failures**: Automatic retry with exponential backoff
- **SERP API Unavailable**: Falls back to relevance-only ranking
- **Validation Errors**: Returns descriptive error messages
- **Network Issues**: Graceful degradation with fallback methods

### Performance Optimizations

- **Batch Processing**: API calls processed in batches
- **Lazy Initialization**: Services initialized only when needed
- **Caching**: Can be added for identical inputs
- **Delays**: Strategic delays prevent rate limiting

---

## Explaining to Others

### Elevator Pitch (30 seconds)
"This is an AI-powered keyword generator for e-commerce products. You give it a product title and description, and it uses three specialized AI agents to generate, validate, and rank SEO keywords. The system combines machine learning with search engine data to produce the top 20 most relevant and popular keywords."

### For Technical Audiences

**Architecture**: "We use a multi-agent orchestration pattern. Three specialized agents work sequentially: Enrichment generates keywords using Datamuse API and Azure AI, Validation filters for relevance and policy compliance using LLM validation, and Ranking combines relevance scores from Azure AI with search popularity data from SERP API to produce the final ranked list."

**Technology**: "Built with Next.js 15 frontend and Express backend, both in TypeScript. We integrate with Azure AI Foundry for LLM capabilities, Datamuse API for keyword enrichment, and SERP API for search metrics. The system includes comprehensive error handling, retry logic, and fallback mechanisms."

### For Non-Technical Audiences

**What it does**: "Imagine you're selling a product online. You need keywords so customers can find your product when they search. This system automatically generates the best keywords for your product by analyzing what you sell and finding related terms that people actually search for."

**How it works**: "You enter your product information, and the system goes through three steps: First, it generates lots of potential keywords. Then, it filters out irrelevant or inappropriate ones. Finally, it ranks them by how relevant they are to your product and how often people search for them. You get the top 20 best keywords."

### For Business Stakeholders

**Value Proposition**: "This system automates SEO keyword research, saving hours of manual work. It generates high-quality, ranked keywords that improve product discoverability and can increase organic search traffic."

**Key Features**:
- Automated keyword generation
- Quality validation (relevance and policy compliance)
- Data-driven ranking (combines relevance and search popularity)
- Export capabilities (CSV, JSON)
- Processing statistics and transparency

### For Developers Joining the Project

**Code Structure**: "The project follows a clean architecture with clear separation: frontend (Next.js), backend (Express), agents (business logic), and services (external API integrations). Each agent is independently testable and maintainable."

**Key Files**:
- `backend/src/orchestrator/agent-orchestrator.ts`: Main workflow coordinator
- `backend/src/agents/*.ts`: Individual agent implementations
- `backend/src/services/*.ts`: External API integrations
- `frontend/components/Chatbot.tsx`: Main UI component

**Getting Started**: "Start with the orchestrator to understand the flow, then dive into individual agents. The services layer shows how we interact with external APIs. The frontend is straightforward React components."

---

## Key Metrics and Statistics

The system tracks and returns:
- **Total Generated**: Number of keywords from enrichment phase
- **After Validation**: Number of keywords after filtering
- **Final Ranked**: Number of keywords in final output (typically 20)
- **Processing Time**: Total time in milliseconds

---

## Future Enhancements

Potential improvements:
1. **Caching**: Cache results for identical inputs
2. **Parallel Processing**: Run agents in parallel where possible
3. **More Agents**: Add agents for competitor analysis, trend analysis
4. **Database**: Store historical keyword data
5. **Analytics**: Track keyword performance over time
6. **Multi-language**: Support for multiple languages
7. **Custom Scoring**: Allow users to adjust relevance/popularity weights

---

## Conclusion

The AI Agent Keyword Generator demonstrates a practical application of multi-agent AI systems. By combining specialized agents, external APIs, and intelligent orchestration, it provides a robust solution for automated SEO keyword generation. The architecture is designed for maintainability, scalability, and reliability, making it suitable for production use.
