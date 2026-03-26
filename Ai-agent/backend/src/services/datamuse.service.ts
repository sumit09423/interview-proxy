import axios, { AxiosInstance } from 'axios';
import { Keyword } from '../types';

export class DatamuseService {
  private client: AxiosInstance;
  private readonly baseUrl = 'https://api.datamuse.com';

  constructor() {
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Find words that have a meaning similar to the input word
   */
  async findSimilarKeywords(keyword: string, maxResults: number = 20): Promise<string[]> {
    try {
      const response = await this.client.get('/words', {
        params: {
          ml: keyword, // "means like"
          max: maxResults
        }
      });

      return response.data
        .map((item: any) => item.word)
        .filter((word: string) => word && word.length > 0)
        .slice(0, maxResults);
    } catch (error) {
      console.error(`Error fetching similar keywords for "${keyword}":`, error);
      return [];
    }
  }

  /**
   * Find words that sound similar to the input word (for typo correction)
   */
  async findSimilarSoundKeywords(keyword: string, maxResults: number = 10): Promise<string[]> {
    try {
      const response = await this.client.get('/words', {
        params: {
          sl: keyword, // "sounds like"
          max: maxResults
        }
      });

      return response.data
        .map((item: any) => item.word)
        .filter((word: string) => word && word.length > 0)
        .slice(0, maxResults);
    } catch (error) {
      console.error(`Error fetching similar-sounding keywords for "${keyword}":`, error);
      return [];
    }
  }

  /**
   * Find words that are spelled similarly (for typo correction)
   */
  async findSimilarSpelling(keyword: string, maxResults: number = 10): Promise<string[]> {
    try {
      const response = await this.client.get('/words', {
        params: {
          sp: keyword, // "spelled like"
          max: maxResults
        }
      });

      return response.data
        .map((item: any) => item.word)
        .filter((word: string) => word && word.length > 0)
        .slice(0, maxResults);
    } catch (error) {
      console.error(`Error fetching similar-spelling keywords for "${keyword}":`, error);
      return [];
    }
  }

  /**
   * Enrich keywords by finding related terms
   */
  async enrichKeywords(keywords: string[]): Promise<string[]> {
    const enrichedKeywords = new Set<string>(keywords.map(k => k.toLowerCase()));

    // Process keywords in batches to avoid rate limiting
    const batchSize = 5;
    for (let i = 0; i < keywords.length; i += batchSize) {
      const batch = keywords.slice(i, i + batchSize);
      
      await Promise.all(
        batch.map(async (keyword) => {
          try {
            // Get similar meaning keywords
            const similar = await this.findSimilarKeywords(keyword, 10);
            similar.forEach(kw => enrichedKeywords.add(kw.toLowerCase()));

            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
          } catch (error) {
            console.error(`Error enriching keyword "${keyword}":`, error);
          }
        })
      );
    }

    return Array.from(enrichedKeywords);
  }

  /**
   * Correct potential typos in keywords
   */
  async correctTypos(keywords: string[]): Promise<string[]> {
    const corrected: string[] = [];

    for (const keyword of keywords) {
      // Check if keyword might be a typo by looking for similar-sounding words
      const similarSound = await this.findSimilarSoundKeywords(keyword, 3);
      const similarSpelling = await this.findSimilarSpelling(keyword, 3);

      // If we find exact matches or very similar words, use the most popular one
      if (similarSound.length > 0 || similarSpelling.length > 0) {
        // For now, keep original if it's a common word, otherwise use first suggestion
        // In production, you might want more sophisticated logic
        const suggestions = [...similarSound, ...similarSpelling];
        if (suggestions.length > 0 && suggestions[0] !== keyword) {
          // Only correct if the suggestion is significantly different
          // This is a simple heuristic - could be improved
          corrected.push(suggestions[0]);
        } else {
          corrected.push(keyword);
        }
      } else {
        corrected.push(keyword);
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    return corrected;
  }
}
