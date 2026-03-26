'use client';

import { useState, useRef, useEffect } from 'react';
import KeywordList from './KeywordList';
import { Keyword, GenerateKeywordsResponse } from '../app/types';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  typing?: boolean;
  keywords?: Keyword[];
  metadata?: GenerateKeywordsResponse['metadata'];
  error?: string;
}

const MIN_MESSAGE_LENGTH = 10;

/** Use the single-line message as both title and description for the API. */
function parseMessageToProduct(message: string): { title: string; description: string } {
  const trimmed = message.trim();
  return { title: trimmed, description: trimmed };
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async () => {
    const trimmed = input.trim();
    if (!trimmed || trimmed.length < MIN_MESSAGE_LENGTH) {
      setError(`Describe your product in one line (at least ${MIN_MESSAGE_LENGTH} characters).`);
      return;
    }

    const { title: parsedTitle, description: parsedDescription } = parseMessageToProduct(trimmed);

    setError(null);
    setInput('');
    setIsLoading(true);

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: trimmed,
      timestamp: new Date(),
    };
    const typingId = `assistant-typing-${Date.now()}`;
    const assistantTyping: Message = {
      id: typingId,
      type: 'assistant',
      content: '',
      timestamp: new Date(),
      typing: true,
    };

    setMessages((prev) => [...prev, userMessage, assistantTyping]);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/generate-keywords`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: parsedTitle, description: parsedDescription }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate keywords');
      }

      const result = data.data as GenerateKeywordsResponse;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === typingId
            ? {
                ...m,
                typing: false,
                content: `Generated **${result.keywords.length}** ranked keywords in ${result.metadata.processingTime}ms.`,
                keywords: result.keywords,
                metadata: result.metadata,
              }
            : m
        )
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === typingId
            ? {
                ...m,
                typing: false,
                content: '',
                error: errorMessage,
              }
            : m
        )
      );
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const exportToCSV = (keywords: Keyword[]) => {
    if (keywords.length === 0) return;
    const headers = ['Rank', 'Keyword', 'Score', 'Relevance Score', 'Search Volume'];
    const rows = keywords.map((k) => [
      k.rank,
      k.keyword,
      k.score?.toFixed(2) || '',
      k.relevanceScore?.toFixed(2) || '',
      k.searchVolume?.toLocaleString() || '',
    ]);
    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `keywords_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const exportToJSON = (keywords: Keyword[], metadata: Message['metadata']) => {
    if (keywords.length === 0) return;
    const data = { exportedAt: new Date().toISOString(), metadata, keywords };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `keywords_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 w-full bg-white dark:bg-gray-900 overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/50">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Keyword Assistant
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Describe your product in one line and I&apos;ll suggest top SEO keywords.
        </p>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-gray-700 dark:text-gray-300 font-medium mb-1">Hi! How can I help?</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm">
              Describe your product in one line. I&apos;ll generate and rank the best SEO keywords for you.
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-3">
              Example: Wireless noise-cancelling headphones with 30h battery
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                msg.type === 'user'
                  ? 'bg-emerald-600 text-white rounded-br-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-md'
              }`}
            >
              {msg.typing ? (
                <div className="flex items-center gap-1 py-1">
                  <span className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              ) : msg.error ? (
                <p className="text-red-600 dark:text-red-400 text-sm">{msg.error}</p>
              ) : (
                <>
                  {msg.content && (
                    <p className="text-sm whitespace-pre-wrap mb-3">
                      {msg.content.replace(/\*\*(.*?)\*\*/g, '$1')}
                    </p>
                  )}
                  {msg.keywords && msg.keywords.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          Top {msg.keywords.length} keywords
                        </span>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => exportToCSV(msg.keywords!)}
                            className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                          >
                            CSV
                          </button>
                          <button
                            type="button"
                            onClick={() => exportToJSON(msg.keywords!, msg.metadata)}
                            className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                          >
                            JSON
                          </button>
                        </div>
                      </div>
                      <KeywordList
                        keywords={msg.keywords}
                        isLoading={false}
                        onCopy={copyToClipboard}
                        compact
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat input */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/50">
        {error && (
          <p className="text-red-600 dark:text-red-400 text-sm mb-2">{error}</p>
        )}
        <div className="flex gap-2 items-center rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-transparent transition-shadow px-3 py-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder="Describe your product in one line..."
            disabled={isLoading}
            className="flex-1 min-h-[40px] bg-transparent text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm focus:outline-none disabled:opacity-50"
            aria-label="Chat message"
          />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !input.trim()}
            className="flex-shrink-0 p-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Send (Enter)"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center">
          Press Enter to send
        </p>
      </div>
    </div>
  );
}
