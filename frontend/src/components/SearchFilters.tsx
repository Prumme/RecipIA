"use client";

import React from "react";
import { DishType } from "@/types/recipe.types";
import { SearchBar } from "./SearchBar";

interface SearchFiltersProps {
  /** Current search query */
  query: string;
  /** Search placeholder text */
  searchPlaceholder?: string;
  /** Whether filters are disabled */
  disabled?: boolean;
  /** Whether search is in progress */
  isSearching?: boolean;
  /** Number of results found */
  resultsCount?: number;
  /** Callback when search query changes */
  onSearch: (query: string) => void;
  /** Callback when search is cleared */
  onClear?: () => void;
  /** Layout direction */
  direction?: "vertical" | "horizontal";
  /** Additional CSS classes */
  className?: string;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  query,
  searchPlaceholder = "Search recipes...",
  disabled = false,
  isSearching = false,
  resultsCount,
  onSearch,
  onClear,
  direction = "vertical",
  className = "",
}) => {
  const isHorizontal = direction === "horizontal";

  return (
    <div className={`${className}`}>
      {/* Search Bar */}
      <div className={isHorizontal ? "mb-0" : "mb-4"}>
        <SearchBar
          placeholder={searchPlaceholder}
          value={query}
          onSearch={onSearch}
          onClear={onClear}
          isLoading={isSearching}
          resultsCount={query ? resultsCount : undefined}
          disabled={disabled}
          autoFocus={false}
          className="w-full max-w-lg mx-auto"
        />
      </div>

      {/* Results Summary */}
      {query && resultsCount !== undefined && (
        <div className="mt-3 text-center">
          <p className="text-sm text-gray-600">
            {resultsCount === 0 ? (
              "No recipes found"
            ) : (
              <>
                <span className="font-medium">{resultsCount}</span>{" "}
                recipe{resultsCount !== 1 ? "s" : ""} found
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
};
