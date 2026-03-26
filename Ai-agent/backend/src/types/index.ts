export interface ProductMetadata {
  title: string;
  description: string;
}

export interface Keyword {
  keyword: string;
  rank?: number;
  score?: number;
  searchVolume?: number;
  relevanceScore?: number;
}

export interface EnrichmentResult {
  keywords: Keyword[];
  source: 'datamuse' | 'llm' | 'extracted';
}

export interface ValidationResult {
  keywords: Keyword[];
  removed: Keyword[];
  reason?: string;
}

export interface RankingResult {
  keywords: Keyword[];
  totalProcessed: number;
}

export interface AgentResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    processingTime?: number;
    agentName?: string;
  };
}

export interface GenerateKeywordsRequest {
  title: string;
  description: string;
}

export interface GenerateKeywordsResponse {
  keywords: Keyword[];
  metadata: {
    totalGenerated: number;
    processingTime: number;
    enrichmentCount: number;
    validationCount: number;
    rankingCount: number;
  };
}
