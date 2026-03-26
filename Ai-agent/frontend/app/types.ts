export interface Keyword {
  keyword: string;
  rank: number;
  score?: number;
  searchVolume?: number;
  relevanceScore?: number;
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

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
