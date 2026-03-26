import { GenerateKeywordsRequest } from '../types';

export function validateGenerateKeywordsRequest(
  body: any
): { valid: boolean; error?: string; data?: GenerateKeywordsRequest } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Request body must be an object' };
  }

  if (!body.title || typeof body.title !== 'string') {
    return { valid: false, error: 'Title is required and must be a string' };
  }

  if (!body.description || typeof body.description !== 'string') {
    return { valid: false, error: 'Description is required and must be a string' };
  }

  const title = body.title.trim();
  const description = body.description.trim();

  if (title.length === 0) {
    return { valid: false, error: 'Title cannot be empty' };
  }

  if (description.length === 0) {
    return { valid: false, error: 'Description cannot be empty' };
  }

  if (title.length > 500) {
    return { valid: false, error: 'Title must be 500 characters or less' };
  }

  if (description.length > 5000) {
    return { valid: false, error: 'Description must be 5000 characters or less' };
  }

  return {
    valid: true,
    data: {
      title,
      description
    }
  };
}
