import { AzureAIService } from '../services/azure-ai.service';
import { DatamuseService } from '../services/datamuse.service';
import { ProductMetadata, Keyword, EnrichmentResult, AgentResponse } from '../types';

export class EnrichmentAgent {
  private azureAIService: AzureAIService;
  private datamuseService: DatamuseService;

  constructor() {
    this.azureAIService = new AzureAIService();
    this.datamuseService = new DatamuseService();
  }

  /**
   * Process product metadata and generate enriched keywords
   */
  async process(metadata: ProductMetadata): Promise<AgentResponse<EnrichmentResult>> {
    const startTime = Date.now();

    try {
      // Step 1: Extract initial keywords from title and description
      const extractedKeywords = this.extractKeywords(metadata.title, metadata.description);

      // Step 2: Use Datamuse API to find related keywords
      const datamuseKeywords = await this.datamuseService.enrichKeywords(extractedKeywords);

      // Step 3: Use Azure AI to generate context-aware keywords (cap existing list for smaller prompt = faster)
      const existingCap = 30;
      const existingKeywords = [...extractedKeywords, ...datamuseKeywords].slice(0, existingCap);
      const llmKeywords = await this.azureAIService.generateKeywords(
        metadata.title,
        metadata.description,
        existingKeywords
      );

      // Step 4: Correct typos
      const allKeywords = [...extractedKeywords, ...datamuseKeywords, ...llmKeywords];
      const correctedKeywords = await this.datamuseService.correctTypos(allKeywords);

      // Step 5: Combine and deduplicate, then cap to 20 for speed (validation + ranking on ~20 only)
      const MAX_KEYWORDS = 20;
      const enrichedKeywords = this.deduplicateKeywords(correctedKeywords).slice(0, MAX_KEYWORDS);

      // Step 6: Create keyword objects with source information
      const keywordObjects: Keyword[] = enrichedKeywords.map((keyword, index) => ({
        keyword: keyword.toLowerCase().trim(),
        rank: index + 1
      }));

      const processingTime = Date.now() - startTime;

      return {
        success: true,
        data: {
          keywords: keywordObjects,
          source: 'mixed'
        },
        metadata: {
          processingTime,
          agentName: 'EnrichmentAgent'
        }
      };
    } catch (error) {
      const processingTime = Date.now() - startTime;
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error in enrichment agent',
        metadata: {
          processingTime,
          agentName: 'EnrichmentAgent'
        }
      };
    }
  }

  /**
   * Extract keywords from title and description
   */
  private extractKeywords(title: string, description: string): string[] {
    const keywords = new Set<string>();

    // Extract from title (split by common separators)
    const titleWords = title
      .toLowerCase()
      .split(/[\s,\-–—]+/)
      .filter(word => word.length > 2 && !this.isStopWord(word));

    titleWords.forEach(word => keywords.add(word));

    // Extract key phrases from title (2-3 word combinations)
    const titlePhrases = this.generatePhrases(titleWords, 2, 3);
    titlePhrases.forEach(phrase => keywords.add(phrase));

    // Extract from description
    const descWords = description
      .toLowerCase()
      .split(/[\s,\-–—.]+/)
      .filter(word => word.length > 2 && !this.isStopWord(word));

    descWords.forEach(word => keywords.add(word));

    // Extract key phrases from description
    const descPhrases = this.generatePhrases(descWords, 2, 3);
    descPhrases.forEach(phrase => keywords.add(phrase));

    return Array.from(keywords);
  }

  /**
   * Generate n-gram phrases from words
   */
  private generatePhrases(words: string[], minLength: number, maxLength: number): string[] {
    const phrases: string[] = [];

    for (let i = 0; i <= words.length - minLength; i++) {
      for (let len = minLength; len <= Math.min(maxLength, words.length - i); len++) {
        const phrase = words.slice(i, i + len).join(' ');
        if (phrase.length > 0) {
          phrases.push(phrase);
        }
      }
    }

    return phrases;
  }

  /**
   * Check if a word is a stop word
   */
  private isStopWord(word: string): boolean {
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
      'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be',
      'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
      'would', 'should', 'could', 'may', 'might', 'must', 'can', 'this',
      'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
      'what', 'which', 'who', 'when', 'where', 'why', 'how', 'all', 'each',
      'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no',
      'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very'
    ]);

    return stopWords.has(word.toLowerCase());
  }

  /**
   * Remove duplicate keywords
   */
  private deduplicateKeywords(keywords: string[]): string[] {
    const seen = new Set<string>();
    const unique: string[] = [];

    for (const keyword of keywords) {
      const normalized = keyword.toLowerCase().trim();
      if (normalized.length > 0 && !seen.has(normalized)) {
        seen.add(normalized);
        unique.push(normalized);
      }
    }

    return unique;
  }
}
