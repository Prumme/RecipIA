"use client";

import RecipeCard from "@/components/RecipeCard";
import { SearchFilters } from "@/components/SearchFilters";
import { SearchResultsState, RecipeListSkeleton } from "@/components/SearchResultsState";
import { useRecipeSearch } from "@/hooks/useRecipeSearch";

import { Users, Clock, ChefHat, Tags } from "lucide-react";

const gridClassName =
  "grid grid-cols-[2fr_100px_100px_150px_1fr] gap-4 items-center px-6";

export default function Home() {
  const {
    query,
    recipes,
    isLoading,
    isSearching,
    error,
    totalResults,
    search,
    clearSearch,
  } = useRecipeSearch();

  return (
    <div className="min-h-screen px-4">
      <header className="mb-8 text-center py-8">
        <h1 className="text-3xl font-bold mb-4">All Recipes</h1>
        <p className="text-gray-600 mb-6">
          Discover our selection of delicious recipes
        </p>
        
        {/* Search and Filters */}
        <SearchFilters
          query={query}
          searchPlaceholder="Search recipes by name..."
          isSearching={isSearching}
          resultsCount={totalResults}
          onSearch={search}
          onClear={clearSearch}
          disabled={isLoading}
        />
      </header>

      <main className="max-w-[90%] mx-auto">
        <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
          {/* Header de la table */}
          <div
            className={`${gridClassName} py-3 bg-gray-50 border-b border-gray-200 font-medium text-sm text-gray-500`}
          >
            <div>Name</div>
            <div className="flex items-center gap-2">
              <Users size={16} />
              <span>Servings</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>Time</span>
            </div>
            <div>Difficulty</div>
            <div className="flex items-center gap-2">
              <Tags size={16} />
              <span>Tags</span>
            </div>
          </div>

          {/* Search Results */}
          <SearchResultsState
            isLoading={isLoading}
            isSearching={isSearching}
            query={query}
            resultsCount={totalResults}
            error={error}
          >
            {/* Corps de la table */}
            {isLoading ? (
              <RecipeListSkeleton count={8} />
            ) : (
              recipes.map((recipe, index) => (
                <RecipeCard key={recipe.Slug || index} recipe={recipe} className={gridClassName} />
              ))
            )}
          </SearchResultsState>
        </div>
      </main>
    </div>
  );
}
