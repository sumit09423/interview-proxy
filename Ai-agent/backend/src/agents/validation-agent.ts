import { AzureAIService } from '../services/azure-ai.service';
import { Keyword, ValidationResult, AgentResponse, ProductMetadata } from '../types';

export class ValidationAgent {
  private azureAIService: AzureAIService;
  private bannedWords: Set<string>;

  constructor() {
    this.azureAIService = new AzureAIService();
    this.bannedWords = this.initializeBannedWords();
  }

  /**
   * Process and validate keywords
   */
  async process(
    keywords: Keyword[],
    metadata: ProductMetadata
  ): Promise<AgentResponse<ValidationResult>> {
    const startTime = Date.now();

    try {
      const keywordStrings = keywords.map(k => k.keyword);
      
      // Step 1: Remove duplicates
      const deduplicated = this.removeDuplicates(keywordStrings);

      // Step 2: Filter banned words
      const { valid: afterBannedFilter, removed: bannedRemoved } = 
        this.filterBannedWords(deduplicated);

      // Step 3: Filter irrelevant keywords using LLM
      const { valid: afterRelevanceFilter, invalid: irrelevantRemoved } = 
        await this.azureAIService.validateKeywords(afterBannedFilter, metadata.title, metadata.description);

      // Step 4: Additional manual filtering
      const { valid: finalValid, removed: manuallyRemoved } = 
        this.manualFilter(afterRelevanceFilter, metadata);

      // Combine all removed keywords
      const allRemoved: Keyword[] = [
        ...bannedRemoved.map(kw => ({ keyword: kw })),
        ...irrelevantRemoved.map(kw => ({ keyword: kw })),
        ...manuallyRemoved.map(kw => ({ keyword: kw }))
      ];

      // Create validated keyword objects
      const validatedKeywords: Keyword[] = finalValid.map((keyword, index) => ({
        keyword,
        rank: index + 1
      }));

      const processingTime = Date.now() - startTime;

      return {
        success: true,
        data: {
          keywords: validatedKeywords,
          removed: allRemoved,
          reason: `Removed ${allRemoved.length} invalid keywords`
        },
        metadata: {
          processingTime,
          agentName: 'ValidationAgent'
        }
      };
    } catch (error) {
      const processingTime = Date.now() - startTime;
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error in validation agent',
        metadata: {
          processingTime,
          agentName: 'ValidationAgent'
        }
      };
    }
  }

  /**
   * Remove duplicate keywords
   */
  private removeDuplicates(keywords: string[]): string[] {
    const seen = new Set<string>();
    const unique: string[] = [];

    for (const keyword of keywords) {
      const normalized = keyword.toLowerCase().trim();
      if (!seen.has(normalized)) {
        seen.add(normalized);
        unique.push(normalized);
      }
    }

    return unique;
  }

  /**
   * Filter banned and inappropriate words
   */
  private filterBannedWords(keywords: string[]): { valid: string[]; removed: string[] } {
    const valid: string[] = [];
    const removed: string[] = [];

    for (const keyword of keywords) {
      const normalized = keyword.toLowerCase().trim();
      const words = normalized.split(/\s+/);

      // Check if any word in the keyword is banned
      const containsBanned = words.some(word => this.bannedWords.has(word));

      if (containsBanned) {
        removed.push(keyword);
      } else {
        valid.push(keyword);
      }
    }

    return { valid, removed };
  }

  /**
   * Manual filtering for common issues
   */
  private manualFilter(
    keywords: string[],
    metadata: ProductMetadata
  ): { valid: string[]; removed: string[] } {
    const valid: string[] = [];
    const removed: string[] = [];

    const titleLower = metadata.title.toLowerCase();
    const descLower = metadata.description.toLowerCase();

    for (const keyword of keywords) {
      const normalized = keyword.toLowerCase().trim();

      // Filter criteria
      if (normalized.length < 2) {
        removed.push(keyword);
        continue;
      }

      if (normalized.length > 50) {
        removed.push(keyword);
        continue;
      }

      // Check if keyword contains only numbers or special characters
      if (/^[0-9\s\-_.,;:!?]+$/.test(normalized)) {
        removed.push(keyword);
        continue;
      }

      // Check if keyword is too generic (single common word)
      if (this.isTooGeneric(normalized)) {
        removed.push(keyword);
        continue;
      }

      // Check basic relevance (keyword should relate to title or description)
      if (!this.hasBasicRelevance(normalized, titleLower, descLower)) {
        removed.push(keyword);
        continue;
      }

      valid.push(keyword);
    }

    return { valid, removed };
  }

  /**
   * Check if keyword is too generic
   */
  private isTooGeneric(keyword: string): boolean {
    const genericWords = new Set([
      'thing', 'stuff', 'item', 'product', 'goods', 'article', 'object',
      'buy', 'sell', 'shop', 'store', 'market', 'online', 'website',
      'cheap', 'best', 'good', 'nice', 'great', 'awesome', 'amazing'
    ]);

    const words = keyword.split(/\s+/);
    return words.length === 1 && genericWords.has(keyword);
  }

  /**
   * Check basic relevance to product
   */
  private hasBasicRelevance(keyword: string, title: string, description: string): boolean {
    // If keyword appears in title or description, it's relevant
    if (title.includes(keyword) || description.includes(keyword)) {
      return true;
    }

    // Check if any significant word from keyword appears in title/description
    const keywordWords = keyword.split(/\s+/).filter(w => w.length > 3);
    const titleWords = title.split(/\s+/);
    const descWords = description.split(/\s+/);

    for (const kwWord of keywordWords) {
      if (titleWords.includes(kwWord) || descWords.includes(kwWord)) {
        return true;
      }
    }

    // If no match found, still allow it (LLM validation will catch truly irrelevant ones)
    return true;
  }

  /**
   * Initialize banned words list
   */
  private initializeBannedWords(): Set<string> {
    return new Set([
      // Add common inappropriate words here
      // This is a basic list - in production, use a comprehensive profanity filter
      'spam', 'scam', 'fraud'
    ]);
  }
}
