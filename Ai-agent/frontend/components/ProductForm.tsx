'use client';

import { useState, useEffect } from 'react';

interface ProductFormProps {
  onSubmit: (title: string, description: string) => void;
  isLoading: boolean;
}

const MAX_TITLE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 1000;
const MIN_TITLE_LENGTH = 3;
const MIN_DESCRIPTION_LENGTH = 10;

export default function ProductForm({ onSubmit, isLoading }: ProductFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [titleError, setTitleError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);

  useEffect(() => {
    // Validate title
    if (title.length > 0 && title.length < MIN_TITLE_LENGTH) {
      setTitleError(`Title must be at least ${MIN_TITLE_LENGTH} characters`);
    } else if (title.length > MAX_TITLE_LENGTH) {
      setTitleError(`Title must be less than ${MAX_TITLE_LENGTH} characters`);
    } else {
      setTitleError(null);
    }

    // Validate description
    if (description.length > 0 && description.length < MIN_DESCRIPTION_LENGTH) {
      setDescriptionError(`Description must be at least ${MIN_DESCRIPTION_LENGTH} characters`);
    } else if (description.length > MAX_DESCRIPTION_LENGTH) {
      setDescriptionError(`Description must be less than ${MAX_DESCRIPTION_LENGTH} characters`);
    } else {
      setDescriptionError(null);
    }
  }, [title, description]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    // Final validation
    if (trimmedTitle.length < MIN_TITLE_LENGTH) {
      setTitleError(`Title must be at least ${MIN_TITLE_LENGTH} characters`);
      return;
    }
    if (trimmedTitle.length > MAX_TITLE_LENGTH) {
      setTitleError(`Title must be less than ${MAX_TITLE_LENGTH} characters`);
      return;
    }
    if (trimmedDescription.length < MIN_DESCRIPTION_LENGTH) {
      setDescriptionError(`Description must be at least ${MIN_DESCRIPTION_LENGTH} characters`);
      return;
    }
    if (trimmedDescription.length > MAX_DESCRIPTION_LENGTH) {
      setDescriptionError(`Description must be less than ${MAX_DESCRIPTION_LENGTH} characters`);
      return;
    }

    if (trimmedTitle && trimmedDescription) {
      onSubmit(trimmedTitle, trimmedDescription);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title Field */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Product Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Wireless Noise Cancelling Headphones"
          className={`input-field ${titleError ? 'border-red-500' : ''}`}
          required
          disabled={isLoading}
          maxLength={MAX_TITLE_LENGTH}
        />
        {titleError && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {titleError}
          </p>
        )}
      </div>

      {/* Description Field */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Product Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., Bluetooth over-ear headphones with deep bass, active noise cancellation, 30-hour battery life, and premium comfort for all-day listening"
          rows={5}
          className={`input-field ${descriptionError ? 'border-red-500' : ''}`}
          required
          disabled={isLoading}
          maxLength={MAX_DESCRIPTION_LENGTH}
        />
        {descriptionError && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {descriptionError}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !title.trim() || !description.trim() || !!titleError || !!descriptionError}
        className="w-full bg-blue-600 text-white font-medium py-2.5 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="spinner w-5 h-5"></div>
            Generating Keywords...
          </span>
        ) : (
          'Generate Keywords'
        )}
      </button>
    </form>
  );
}
