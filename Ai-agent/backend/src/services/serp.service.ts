import axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { Keyword } from '../types';

// Load .env from root directory
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export interface SERPResult {
  keyword: string;
  searchVolume?: number;
  competition?: string;
  cpc?: number;
  results?: number;
}

export class SERPService {
  private client: AxiosInstance;
  private apiKey: string;
  private apiUrl: string;
  /** Semust uses SEMUST-API-USER / SEMUST-API-PASSWORD; other providers use Bearer. */
  private isSemust: boolean;
  private hasCredentials: boolean;

  constructor() {
    this.apiKey = process.env.SERP_API_KEY || '';
    this.apiUrl = process.env.SERP_API_URL || 'https://data.semust.com/v1/serp';
    this.isSemust = this.apiUrl.includes('semust.com');

    const apiUser = process.env.SERP_API_USER || this.apiKey;
    const apiPassword = process.env.SERP_API_PASSWORD || this.apiKey;
    const hasSemustCreds = this.isSemust && apiUser && apiPassword;
    const hasBearerCreds = !this.isSemust && this.apiKey;
    this.hasCredentials = !!hasSemustCreds || !!hasBearerCreds;

    if (!this.hasCredentials) {
      console.warn('SERP API not configured. Ranking will use fallback methods.');
    }

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.isSemust && apiUser && apiPassword) {
      headers['SEMUST-API-USER'] = apiUser;
      headers['SEMUST-API-PASSWORD'] = apiPassword;
    } else if (!this.isSemust && this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    this.client = axios.create({
      baseURL: this.apiUrl,
      timeout: 15000,
      headers
    });
  }

  /**
   * Get search metrics for a keyword
   */
  async getKeywordMetrics(keyword: string): Promise<SERPResult> {
    if (!this.hasCredentials) {
      return {
        keyword,
        searchVolume: 0,
        competition: 'low',
        cpc: 0,
        results: 0
      };
    }

    try {
      // Semust: POST to base path /v1/serp; other providers may use /search
      const path = this.isSemust ? '' : '/search';
      const response = await this.client.post(path, {
        keyword,
        language: 'en',
        country: this.isSemust ? 'US' : 'us',
        ...(this.isSemust && { format: 'json' })
      });

      const data = response.data;
      // Semust returns organic[], not search_volume; use organic length as results proxy
      const results = this.isSemust
        ? (Array.isArray(data.organic) ? data.organic.length : 0) || data.results || data.total_results || 0
        : (data.results ?? data.total_results ?? 0);
      return {
        keyword,
        searchVolume: data.search_volume ?? data.volume ?? 0,
        competition: data.competition || 'medium',
        cpc: data.cpc ?? data.cost_per_click ?? 0,
        results: Number(results) || 0
      };
    } catch (error) {
      console.error(`Error fetching SERP data for "${keyword}":`, error);
      // Fallback: return default metrics
      return {
        keyword,
        searchVolume: 0,
        competition: 'low',
        cpc: 0,
        results: 0
      };
    }
  }

  /**
   * Get metrics for multiple keywords (with batching)
   */
  async getKeywordsMetrics(keywords: string[]): Promise<Map<string, SERPResult>> {
    const results = new Map<string, SERPResult>();

    // Process in batches to avoid rate limiting
    const batchSize = 5;
    for (let i = 0; i < keywords.length; i += batchSize) {
      const batch = keywords.slice(i, i + batchSize);
      
      await Promise.all(
        batch.map(async (keyword) => {
          try {
            const metrics = await this.getKeywordMetrics(keyword);
            results.set(keyword.toLowerCase(), metrics);
            
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
          } catch (error) {
            console.error(`Error processing keyword "${keyword}":`, error);
            // Add default metrics on error
            results.set(keyword.toLowerCase(), {
              keyword,
              searchVolume: 0,
              competition: 'low',
              cpc: 0,
              results: 0
            });
          }
        })
      );
    }

    return results;
  }

  /**
   * Calculate popularity score based on SERP metrics
   */
  calculatePopularityScore(metrics: SERPResult): number {
    // Normalize search volume (assuming max is 1M searches/month)
    const volumeScore = Math.min(metrics.searchVolume || 0, 1000000) / 10000;
    
    // Competition factor (lower competition = higher score)
    const competitionFactor = metrics.competition === 'low' ? 1.2 : 
                             metrics.competition === 'medium' ? 1.0 : 0.8;
    
    // Results factor (more results = more established keyword)
    const resultsFactor = Math.min(Math.log10((metrics.results || 0) + 1) / 6, 1);
    
    // Combine factors
    const score = volumeScore * competitionFactor * (0.5 + 0.5 * resultsFactor);
    
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Rank keywords by popularity
   */
  async rankKeywordsByPopularity(keywords: Keyword[]): Promise<Keyword[]> {
    const keywordStrings = keywords.map(k => k.keyword);
    const metricsMap = await this.getKeywordsMetrics(keywordStrings);

    return keywords.map(keyword => {
      const metrics = metricsMap.get(keyword.keyword.toLowerCase()) || {
        keyword: keyword.keyword,
        searchVolume: 0,
        competition: 'low',
        cpc: 0,
        results: 0
      };

      const popularityScore = this.calculatePopularityScore(metrics);

      return {
        ...keyword,
        searchVolume: metrics.searchVolume,
        score: (keyword.score || 0) + popularityScore * 0.4 // Weight popularity at 40%
      };
    });
  }
}
