"use client";

import React from "react";
import { Search, AlertCircle, Loader2 } from "lucide-react";

interface SearchResultsStateProps {
  /** Whether data is currently loading */
  isLoading: boolean;
  /** Whether a search is in progress */
  isSearching: boolean;
  /** Current search query */
  query: string;
  /** Number of results found */
  resultsCount: number;
  /** Error message if any */
  error?: string | null;
  /** Children to render when there are results */
  children: React.ReactNode;
}

export const SearchResultsState: React.FC<SearchResultsStateProps> = ({
  isLoading,
  isSearching,
  query,
  resultsCount,
  error,
  children,
}) => {
  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Oops! Something went wrong
        </h3>
        <p className="text-gray-600 max-w-md">
          {error}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Please try again or refresh the page.
        </p>
      </div>
    );
  }

  // Initial loading state
  if (isLoading && !query) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Loading recipes...</p>
      </div>
    );
  }

  // Search loading state
  if (isSearching) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">
          Searching for "{query}"...
        </p>
      </div>
    );
  }

  // No results found state
  if (query && resultsCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Search className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No recipes found
        </h3>
        <p className="text-gray-600 max-w-md">
          We couldn't find any recipes matching "{query}".
        </p>
        <div className="mt-4 text-sm text-gray-500">
          <p>Try:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Checking your spelling</li>
            <li>Using different keywords</li>
            <li>Being less specific</li>
          </ul>
        </div>
      </div>
    );
  }

  // Results found - render children
  return <>{children}</>;
};

// Loading skeleton component for recipe cards
export const RecipeCardSkeleton: React.FC = () => {
  return (
    <div className="w-full border-b border-gray-200 animate-pulse">
      <div className="py-4">
        <div className="grid grid-cols-[2fr_100px_100px_150px_1fr] gap-4 items-center px-6">
          {/* Name & Type */}
          <div className="space-y-2">
            <div className="h-5 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>

          {/* Servings */}
          <div className="h-4 bg-gray-300 rounded w-8"></div>

          {/* Time */}
          <div className="h-4 bg-gray-300 rounded w-12"></div>

          {/* Difficulty */}
          <div className="h-6 bg-gray-300 rounded-full w-16"></div>

          {/* Tags */}
          <div className="flex gap-1">
            <div className="h-5 bg-gray-300 rounded w-12"></div>
            <div className="h-5 bg-gray-300 rounded w-16"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Multiple skeletons for initial loading
export const RecipeListSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <RecipeCardSkeleton key={index} />
      ))}
    </>
  );
};
