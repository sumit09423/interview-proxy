import { AzureAIService } from '../services/azure-ai.service';
import { SERPService } from '../services/serp.service';
import { Keyword, RankingResult, AgentResponse, ProductMetadata } from '../types';

export class RankingAgent {
  private azureAIService: AzureAIService;
  private serpService: SERPService;

  constructor() {
    this.azureAIService = new AzureAIService();
    this.serpService = new SERPService();
  }

  /**
   * Process and rank keywords
   */
  async process(
    keywords: Keyword[],
    metadata: ProductMetadata,
    topN: number = 20
  ): Promise<AgentResponse<RankingResult>> {
    const startTime = Date.now();

    try {
      // Step 1: Calculate relevance scores using LLM
      const keywordStrings = keywords.map(k => k.keyword);
      const relevanceScores = await this.azureAIService.calculateRelevanceScores(
        keywordStrings,
        metadata.title,
        metadata.description
      );

      // Step 2: Get SERP metrics (search volume, competition, etc.)
      const rankedByPopularity = await this.serpService.rankKeywordsByPopularity(keywords);

      // Step 3: Combine relevance and popularity scores
      const combinedKeywords = rankedByPopularity.map(keyword => {
        const relevanceScore = relevanceScores.get(keyword.keyword.toLowerCase()) || 50;
        
        // Combine scores: 60% relevance, 40% popularity
        const combinedScore = (relevanceScore * 0.6) + ((keyword.score || 0) * 0.4);

        return {
          ...keyword,
          relevanceScore,
          score: combinedScore
        };
      });

      // Step 4: Sort by combined score (descending)
      const sortedKeywords = combinedKeywords.sort((a, b) => {
        const scoreA = a.score || 0;
        const scoreB = b.score || 0;
        return scoreB - scoreA;
      });

      // Step 5: Take top N keywords and assign ranks
      const topKeywords = sortedKeywords.slice(0, topN).map((keyword, index) => ({
        ...keyword,
        rank: index + 1
      }));

      const processingTime = Date.now() - startTime;

      return {
        success: true,
        data: {
          keywords: topKeywords,
          totalProcessed: keywords.length
        },
        metadata: {
          processingTime,
          agentName: 'RankingAgent'
        }
      };
    } catch (error) {
      const processingTime = Date.now() - startTime;
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error in ranking agent',
        metadata: {
          processingTime,
          agentName: 'RankingAgent'
        }
      };
    }
  }

  /**
   * Alternative ranking method using only relevance (fallback)
   */
  async rankByRelevanceOnly(
    keywords: Keyword[],
    metadata: ProductMetadata,
    topN: number = 20
  ): Promise<AgentResponse<RankingResult>> {
    const startTime = Date.now();

    try {
      const keywordStrings = keywords.map(k => k.keyword);
      const relevanceScores = await this.azureAIService.calculateRelevanceScores(
        keywordStrings,
        metadata.title,
        metadata.description
      );

      const rankedKeywords = keywords
        .map(keyword => ({
          ...keyword,
          relevanceScore: relevanceScores.get(keyword.keyword.toLowerCase()) || 50,
          score: relevanceScores.get(keyword.keyword.toLowerCase()) || 50
        }))
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, topN)
        .map((keyword, index) => ({
          ...keyword,
          rank: index + 1
        }));

      const processingTime = Date.now() - startTime;

      return {
        success: true,
        data: {
          keywords: rankedKeywords,
          totalProcessed: keywords.length
        },
        metadata: {
          processingTime,
          agentName: 'RankingAgent'
        }
      };
    } catch (error) {
      const processingTime = Date.now() - startTime;
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error in ranking agent',
        metadata: {
          processingTime,
          agentName: 'RankingAgent'
        }
      };
    }
  }
}
