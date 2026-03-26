import { Request, Response } from 'express';
import { AgentOrchestrator } from '../orchestrator/agent-orchestrator';
import { validateGenerateKeywordsRequest } from '../utils/validation';
import { GenerateKeywordsRequest } from '../types';

export class KeywordsController {
  private orchestrator: AgentOrchestrator;

  constructor() {
    this.orchestrator = new AgentOrchestrator();
  }

  /**
   * Generate keywords endpoint handler
   */
  async generateKeywords(req: Request, res: Response): Promise<void> {
    try {
      // Validate request
      const validation = validateGenerateKeywordsRequest(req.body);
      if (!validation.valid) {
        res.status(400).json({
          success: false,
          error: validation.error
        });
        return;
      }

      const requestData = validation.data as GenerateKeywordsRequest;

      // Process through orchestrator
      const result = await this.orchestrator.processWithRetry(requestData, 2);

      // Return success response
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error in generateKeywords controller:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  }
}
