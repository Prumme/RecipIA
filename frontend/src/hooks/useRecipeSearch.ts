import { useState, useEffect, useCallback, useRef } from "react";
import { Recipe } from "@/types/recipe.types";
import { recipeApiService, ApiError } from "@/services/RecipeApiService";

interface UseRecipeSearchProps {
  /** Author username for filtering by author (optional) */
  authorUsername?: string;
  /** Default page size */
  pageSize?: number;
  /** Enable caching */
  enableCache?: boolean;
}

interface SearchState {
  query: string;
  recipes: Recipe[];
  isLoading: boolean;
  isSearching: boolean;
  error: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  currentPage: number;
  totalResults: number;
}

export const useRecipeSearch = ({
  authorUsername,
  pageSize = 20,
  enableCache = true,
}: UseRecipeSearchProps = {}) => {
  const [state, setState] = useState<SearchState>({
    query: "",
    recipes: [],
    isLoading: false,
    isSearching: false,
    error: null,
    hasNextPage: false,
    hasPreviousPage: false,
    currentPage: 1,
    totalResults: 0,
  });

  // Debounce timer ref
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  
  // Cache for search results
  const searchCache = useRef<Map<string, any>>(new Map());

  /**
   * Fetch recipes from API using the service
   */
  const fetchRecipes = useCallback(async (query: string, page: number = 1) => {
    try {
      const cacheKey = `${query}-${page}-${authorUsername || 'all'}`;

      // Check cache first
      if (enableCache && searchCache.current.has(cacheKey)) {
        return searchCache.current.get(cacheKey);
      }

      const data = await recipeApiService.searchRecipes({
        query: query.trim() || undefined,
        page,
        pageSize,
        enableCache,
        authorUsername,
      });
      
      // Cache the result
      if (enableCache) {
        searchCache.current.set(cacheKey, data);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching recipes:', error);
      throw error;
    }
  }, [authorUsername, pageSize, enableCache]);

  /**
   * Perform search with debouncing
   */
  const performSearch = useCallback(async (query: string, page: number = 1, append: boolean = false) => {
    try {
      setState(prev => ({
        ...prev,
        isLoading: !append,
        isSearching: true,
        error: null,
      }));

      const data = await fetchRecipes(query, page);

      setState(prev => ({
        ...prev,
        recipes: append ? [...prev.recipes, ...data.items] : data.items,
        hasNextPage: data.hasNextPage || false,
        hasPreviousPage: data.hasPreviousPage || false,
        currentPage: page,
        totalResults: data.items.length,
        isLoading: false,
        isSearching: false,
        query,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof ApiError 
          ? error.message 
          : error instanceof Error 
            ? error.message 
            : 'An error occurred',
        isLoading: false,
        isSearching: false,
      }));
    }
  }, [fetchRecipes]);

  /**
   * Search recipes with debouncing
   */
  const search = useCallback((query: string) => {
    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer
    debounceTimer.current = setTimeout(() => {
      performSearch(query, 1, false);
    }, 300); // 300ms debounce
  }, [performSearch]);

  /**
   * Load initial recipes (no search query)
   */
  const loadInitialRecipes = useCallback(() => {
    performSearch('', 1, false);
  }, [performSearch]);

  /**
   * Load more recipes (pagination)
   */
  const loadMore = useCallback(() => {
    if (state.hasNextPage && !state.isLoading) {
      performSearch(state.query, state.currentPage + 1, true);
    }
  }, [state.hasNextPage, state.isLoading, state.query, state.currentPage, performSearch]);

  /**
   * Clear search and reset to initial state
   */
  const clearSearch = useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    setState(prev => ({
      ...prev,
      query: '',
      dishType: null,
      error: null,
    }));
    
    loadInitialRecipes();
  }, [loadInitialRecipes]);

  /**
   * Clear cache
   */
  const clearCache = useCallback(() => {
    searchCache.current.clear();
  }, []);

  // Load initial recipes on mount
  useEffect(() => {
    loadInitialRecipes();
  }, [loadInitialRecipes]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return {
    // State
    query: state.query,
    recipes: state.recipes,
    isLoading: state.isLoading,
    isSearching: state.isSearching,
    error: state.error,
    hasNextPage: state.hasNextPage,
    hasPreviousPage: state.hasPreviousPage,
    currentPage: state.currentPage,
    totalResults: state.totalResults,
    
    // Actions
    search,
    loadMore,
    clearSearch,
    clearCache,
    refresh: loadInitialRecipes,
  };
};
