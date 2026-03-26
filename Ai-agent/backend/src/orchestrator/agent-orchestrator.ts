import { EnrichmentAgent } from '../agents/enrichment-agent';
import { ValidationAgent } from '../agents/validation-agent';
import { RankingAgent } from '../agents/ranking-agent';
import {
  ProductMetadata,
  GenerateKeywordsResponse,
  Keyword,
  AgentResponse
} from '../types';

export class AgentOrchestrator {
  private enrichmentAgent: EnrichmentAgent;
  private validationAgent: ValidationAgent;
  private rankingAgent: RankingAgent;

  constructor() {
    this.enrichmentAgent = new EnrichmentAgent();
    this.validationAgent = new ValidationAgent();
    this.rankingAgent = new RankingAgent();
  }

  /**
   * Orchestrate the multi-agent workflow
   */
  async process(metadata: ProductMetadata): Promise<GenerateKeywordsResponse> {
    const overallStartTime = Date.now();
    let enrichmentCount = 0;
    let validationCount = 0;
    let rankingCount = 0;

    try {
      // Step 1: Enrichment Agent
      console.log('Starting Enrichment Agent...');
      const enrichmentResult = await this.enrichmentAgent.process(metadata);

      if (!enrichmentResult.success || !enrichmentResult.data) {
        throw new Error(`Enrichment failed: ${enrichmentResult.error || 'Unknown error'}`);
      }

      // Cap enrichment so validation/ranking run on ~20 only (target: top 20, fast pipeline)
      const ENRICHMENT_CAP = 20;
      const rawEnrichmentCount = enrichmentResult.data.keywords.length;
      if (rawEnrichmentCount > ENRICHMENT_CAP) {
        enrichmentResult.data.keywords = enrichmentResult.data.keywords.slice(0, ENRICHMENT_CAP);
        console.log(`Enrichment completed: ${rawEnrichmentCount} keywords generated, using top ${ENRICHMENT_CAP} for validation`);
      } else {
        console.log(`Enrichment completed: ${rawEnrichmentCount} keywords generated`);
      }
      enrichmentCount = enrichmentResult.data.keywords.length;

      // Step 2: Validation Agent
      console.log('Starting Validation Agent...');
      const validationResult = await this.validationAgent.process(
        enrichmentResult.data.keywords,
        metadata
      );

      if (!validationResult.success || !validationResult.data) {
        throw new Error(`Validation failed: ${validationResult.error || 'Unknown error'}`);
      }

      validationCount = validationResult.data.keywords.length;
      console.log(`Validation completed: ${validationCount} keywords validated (removed ${validationResult.data.removed.length})`);

      // Step 3: Ranking Agent (input capped to 20; final output = top 20)
      const RANKING_INPUT_CAP = 20;
      const TOP_N_KEYWORDS = 20;
      const keywordsForRanking = validationResult.data.keywords.slice(0, RANKING_INPUT_CAP);
      console.log('Starting Ranking Agent...');
      let rankingResult: AgentResponse<any>;

      try {
        rankingResult = await this.rankingAgent.process(
          keywordsForRanking,
          metadata,
          TOP_N_KEYWORDS
        );
      } catch (error) {
        // Fallback to relevance-only ranking if SERP API fails
        console.warn('SERP API failed, using relevance-only ranking:', error);
        rankingResult = await this.rankingAgent.rankByRelevanceOnly(
          keywordsForRanking,
          metadata,
          TOP_N_KEYWORDS
        );
      }

      if (!rankingResult.success || !rankingResult.data) {
        throw new Error(`Ranking failed: ${rankingResult.error || 'Unknown error'}`);
      }

      rankingCount = rankingResult.data.keywords.length;
      console.log(`Ranking completed: Top ${rankingCount} keywords selected`);

      const processingTime = Date.now() - overallStartTime;

      return {
        keywords: rankingResult.data.keywords,
        metadata: {
          totalGenerated: enrichmentCount,
          processingTime,
          enrichmentCount,
          validationCount,
          rankingCount
        }
      };
    } catch (error) {
      console.error('Orchestration error:', error);
      throw error;
    }
  }

  /**
   * Process with retry logic
   */
  async processWithRetry(
    metadata: ProductMetadata,
    maxRetries: number = 2
  ): Promise<GenerateKeywordsResponse> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          console.log(`Retry attempt ${attempt}/${maxRetries}...`);
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
        }

        return await this.process(metadata);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.error(`Attempt ${attempt + 1} failed:`, lastError.message);
      }
    }

    throw lastError || new Error('Unknown error in orchestration');
  }
}
