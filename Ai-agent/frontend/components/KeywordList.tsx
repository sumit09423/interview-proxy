'use client';

import { useState } from 'react';
import { Keyword } from '../app/types';

interface KeywordListProps {
  keywords: Keyword[];
  isLoading?: boolean;
  onCopy?: (text: string) => Promise<boolean>;
  /** Compact layout for chat bubbles (no header, smaller items) */
  compact?: boolean;
}

export default function KeywordList({ keywords, isLoading, onCopy, compact = false }: KeywordListProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleCopyKeyword = async (keyword: string, index: number) => {
    if (onCopy) {
      const success = await onCopy(keyword);
      if (success) {
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
      }
    }
  };

  const handleCopyAll = async () => {
    if (onCopy && keywords.length > 0) {
      const allKeywords = keywords.map((k) => k.keyword).join('\n');
      const success = await onCopy(allKeywords);
      if (success) {
        setCopiedAll(true);
        setTimeout(() => setCopiedAll(false), 2000);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (keywords.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <p className="text-gray-500 dark:text-gray-400">
          Submit a product title and description to generate keywords
        </p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="space-y-1.5 max-h-64 overflow-y-auto">
        {keywords.map((keyword, index) => (
          <div
            key={keyword.rank}
            className="group flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
          >
            <span className="flex-shrink-0 w-5 h-5 rounded flex items-center justify-center text-xs font-medium bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300">
              {keyword.rank}
            </span>
            <span className="flex-1 text-sm text-gray-900 dark:text-gray-100 truncate">
              {keyword.keyword}
            </span>
            {onCopy && (
              <button
                type="button"
                onClick={() => handleCopyKeyword(keyword.keyword, index)}
                className="flex-shrink-0 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-200 dark:hover:bg-gray-600"
                title="Copy"
              >
                {copiedIndex === index ? (
                  <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Copy All Button */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">
          Top {keywords.length} Ranked Keywords
        </h3>
        {onCopy && (
          <button
            onClick={handleCopyAll}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center gap-2 transition-colors"
            title="Copy all keywords"
          >
            {copiedAll ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Copied!</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Copy All</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Keywords List */}
      <div className="space-y-3">
        {keywords.map((keyword, index) => (
          <div
            key={keyword.rank}
            className="group border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  keyword.rank <= 3
                    ? 'bg-yellow-500 text-white'
                    : keyword.rank <= 10
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-400 text-white'
                }`}>
                  {keyword.rank}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-gray-900 dark:text-gray-100 break-words">
                    {keyword.keyword}
                  </span>
                  {onCopy && (
                    <button
                      onClick={() => handleCopyKeyword(keyword.keyword, index)}
                      className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      title="Copy keyword"
                    >
                      {copiedIndex === index ? (
                        <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </button>
                  )}
                </div>
                
                {/* Stats */}
                <div className="flex flex-wrap items-center gap-2 mt-2 text-sm">
                  {keyword.score !== undefined && (
                    <span className="badge-primary">
                      Score: {Math.round(keyword.score)}
                    </span>
                  )}
                  {keyword.relevanceScore !== undefined && (
                    <span className="badge-success">
                      Relevance: {Math.round(keyword.relevanceScore)}%
                    </span>
                  )}
                  {keyword.searchVolume !== undefined && keyword.searchVolume > 0 && (
                    <span className="badge-warning">
                      {keyword.searchVolume.toLocaleString()}/mo
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Footer */}
      {keywords.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>
              Showing {keywords.length} {keywords.length === 1 ? 'keyword' : 'keywords'}
            </span>
            {keywords.some((k) => k.searchVolume && k.searchVolume > 0) && (
              <span>
                Total search volume:{' '}
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {keywords
                    .reduce((sum, k) => sum + (k.searchVolume || 0), 0)
                    .toLocaleString()}
                  /mo
                </span>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
