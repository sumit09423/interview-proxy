import axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from root directory
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

/** Extract a readable message from Azure OpenAI / Axios errors (e.g. 401 body). */
function getAzureErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'response' in error) {
    const res = (error as { response?: { status?: number; data?: { error?: { message?: string; code?: string } } } }).response;
    if (res?.data?.error?.message) return `${res.status ?? 'Error'}: ${res.data.error.message}`;
    if (res?.status) return `HTTP ${res.status}: ${(res as { statusText?: string }).statusText ?? 'Request failed'}`;
  }
  return error instanceof Error ? error.message : 'Unknown error';
}

export class AzureAIService {
  private client: AxiosInstance | null = null;
  private deploymentName: string;
  private endpoint: string;
  private apiKey: string;
  private initialized: boolean = false;

  constructor() {
    this.endpoint = process.env.AZURE_AI_FOUNDRY_ENDPOINT || '';
    this.apiKey = process.env.AZURE_AI_FOUNDRY_API_KEY || '';
    this.deploymentName = process.env.AZURE_AI_FOUNDRY_DEPLOYMENT_NAME || 'gpt-4';
  }

  /**
   * Lazy initialization - only initialize when actually needed
   */
  private ensureInitialized(): void {
    if (this.initialized && this.client) {
      return;
    }

    if (!this.endpoint || !this.apiKey) {
      throw new Error(
        'Azure AI Foundry endpoint and API key must be configured. ' +
        'Please set AZURE_AI_FOUNDRY_ENDPOINT and AZURE_AI_FOUNDRY_API_KEY environment variables.'
      );
    }

    // Use OpenAI-compatible endpoint format
    const baseURL = this.endpoint.includes('/openai/v1') 
      ? this.endpoint.replace('/openai/v1', '')
      : this.endpoint;

    this.client = axios.create({
      baseURL: `${baseURL}/openai/v1`,
      headers: {
        'Content-Type': 'application/json',
        'api-key': this.apiKey
      },
      timeout: 60000
    });

    this.initialized = true;
  }

  /**
   * Generate keywords using Azure AI Foundry LLM
   */
  async generateKeywords(
    title: string,
    description: string,
    existingKeywords: string[] = []
  ): Promise<string[]> {
    this.ensureInitialized();
    const prompt = this.buildKeywordGenerationPrompt(title, description, existingKeywords);

    try {
      const response = await this.client!.post('/chat/completions', {
        model: this.deploymentName,
        messages: [
          {
            role: 'system',
            content: 'Generate SEO keywords for the product. Return only keywords, one per line, no numbering.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_completion_tokens: 200
      });

      const content = response.data.choices[0]?.message?.content || '';
      return this.parseKeywordsFromResponse(content);
    } catch (error: unknown) {
      const azureMessage = getAzureErrorMessage(error);
      console.error('Error generating keywords with Azure AI:', azureMessage);
      throw new Error(`Failed to generate keywords: ${azureMessage}`);
    }
  }

  /**
   * Validate and filter keywords using LLM
   */
  async validateKeywords(
    keywords: string[],
    title: string,
    description: string
  ): Promise<{ valid: string[]; invalid: string[] }> {
    this.ensureInitialized();
    const prompt = this.buildValidationPrompt(keywords, title, description);

    try {
      const response = await this.client!.post('/chat/completions', {
        model: this.deploymentName,
        messages: [
          {
            role: 'system',
            content: 'Return JSON only: {"valid": ["word1"], "invalid": ["word2"]}. valid = relevant/safe keywords, invalid = irrelevant or policy-breaking.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_completion_tokens: 500,
        response_format: { type: 'json_object' }
      });

      const content = response.data.choices[0]?.message?.content || '{}';
      const result = JSON.parse(content);
      
      return {
        valid: Array.isArray(result.valid) ? result.valid : [],
        invalid: Array.isArray(result.invalid) ? result.invalid : []
      };
    } catch (error) {
      console.error('Error validating keywords with Azure AI:', error);
      // Fallback: return all keywords as valid if validation fails
      return { valid: keywords, invalid: [] };
    }
  }

  /**
   * Calculate relevance scores for keywords
   */
  async calculateRelevanceScores(
    keywords: string[],
    title: string,
    description: string
  ): Promise<Map<string, number>> {
    this.ensureInitialized();
    const prompt = this.buildRelevancePrompt(keywords, title, description);

    try {
      const response = await this.client!.post('/chat/completions', {
        model: this.deploymentName,
        messages: [
          {
            role: 'system',
            content: 'Return JSON only: keyword as key, score 0-100 as value. No other text.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_completion_tokens: 500,
        response_format: { type: 'json_object' }
      });

      const content = response.data.choices[0]?.message?.content || '{}';
      const scores = JSON.parse(content);
      
      const scoreMap = new Map<string, number>();
      for (const [keyword, score] of Object.entries(scores)) {
        const numScore = typeof score === 'number' ? score : parseFloat(String(score));
        if (!isNaN(numScore)) {
          scoreMap.set(keyword.toLowerCase().trim(), Math.max(0, Math.min(100, numScore)));
        }
      }

      return scoreMap;
    } catch (error) {
      console.error('Error calculating relevance scores:', error);
      // Fallback: return default scores
      const defaultScores = new Map<string, number>();
      keywords.forEach(kw => defaultScores.set(kw.toLowerCase().trim(), 50));
      return defaultScores;
    }
  }

  private buildKeywordGenerationPrompt(
    title: string,
    description: string,
    existingKeywords: string[] = []
  ): string {
    let prompt = `Generate SEO-friendly keywords for this product:\n\nTitle: ${title}\nDescription: ${description}\n\n`;
    
    if (existingKeywords.length > 0) {
      prompt += `Already generated keywords: ${existingKeywords.join(', ')}\n\n`;
      prompt += `Generate additional related keywords that complement the existing ones.\n`;
    } else {
      prompt += `Generate diverse keywords including:\n`;
      prompt += `- Product type variations\n`;
      prompt += `- Feature-based keywords\n`;
      prompt += `- Use case keywords\n`;
      prompt += `- Long-tail keywords\n`;
    }

    prompt += `\nReturn only keywords, one per line, without numbering.`;
    return prompt;
  }

  private buildValidationPrompt(
    keywords: string[],
    title: string,
    description: string
  ): string {
    return `Validate these keywords for the product:\n\nTitle: ${title}\nDescription: ${description}\n\nKeywords to validate:\n${keywords.map((kw, i) => `${i + 1}. ${kw}`).join('\n')}\n\nRemove keywords that are:\n- Not relevant to the product\n- Inappropriate or policy-violating\n- Age-restricted content\n- Duplicates\n- Too generic or vague\n\nReturn JSON: {"valid": ["keyword1", "keyword2"], "invalid": ["bad1", "bad2"]}`;
  }

  private buildRelevancePrompt(
    keywords: string[],
    title: string,
    description: string
  ): string {
    return `Score keyword relevance (0-100) for this product:\n\nTitle: ${title}\nDescription: ${description}\n\nKeywords:\n${keywords.join(', ')}\n\nReturn JSON object with keyword as key and score (0-100) as value.`;
  }

  private parseKeywordsFromResponse(content: string): string[] {
    return content
      .split('\n')
      .map(line => line.trim())
      .filter(line => {
        // Remove numbering, bullets, and empty lines
        const cleaned = line.replace(/^[\d.\-\*•]\s*/, '').trim();
        return cleaned.length > 0 && cleaned.length < 100; // Reasonable keyword length
      })
      .map(line => line.replace(/^[\d.\-\*•]\s*/, '').trim().toLowerCase())
      .filter((kw, index, self) => self.indexOf(kw) === index); // Remove duplicates
  }
}
