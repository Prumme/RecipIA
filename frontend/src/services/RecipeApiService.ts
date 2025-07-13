import { API_URL } from "@/core/constant";
import { Recipe, DishType } from "@/types/recipe.types";

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface SearchRecipesParams {
  query?: string;
  page?: number;
  pageSize?: number;
  enableCache?: boolean;
  authorUsername?: string;
  dishType?: DishType;
}

export interface ApiError {
  message: string;
  status: number;
}

export class ApiError extends Error {
  constructor(public message: string, public status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

class RecipeApiService {
  private async fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const token = localStorage.getItem("token");
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP error! status: ${response.status}`,
        response.status
      );
    }

    return response;
  }

  /**
   * Search recipes with optional filters
   */
  async searchRecipes({
    query = "",
    page = 1,
    pageSize = 20,
    enableCache = true,
    authorUsername,
    dishType,
  }: SearchRecipesParams): Promise<PaginatedResponse<Recipe>> {
    try {
      // Build URL based on whether we're searching by author or globally
      let url = authorUsername 
        ? `${API_URL}recipes/author/${encodeURIComponent(authorUsername)}`
        : `${API_URL}recipes`;

      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        cache: enableCache.toString(),
      });

      if (query.trim()) {
        params.append('s', query.trim());
      }

      if (dishType) {
        params.append('dishType', dishType);
      }

      url += `?${params.toString()}`;

      const response = await this.fetchWithAuth(url);
      const data = await response.json();

      return {
        items: data.items || [],
        page: data.page || page,
        pageSize: data.pageSize || pageSize,
        hasNextPage: data.hasNextPage || false,
        hasPreviousPage: data.hasPreviousPage || false,
      };
    } catch (error) {
      console.error('Error searching recipes:', error);
      throw error;
    }
  }

  /**
   * Get all recipes (no search)
   */
  async getAllRecipes(
    page: number = 1, 
    pageSize: number = 20,
    enableCache: boolean = true
  ): Promise<PaginatedResponse<Recipe>> {
    return this.searchRecipes({ page, pageSize, enableCache });
  }

  /**
   * Get recipes by author
   */
  async getRecipesByAuthor(
    authorUsername: string,
    page: number = 1,
    pageSize: number = 20,
    enableCache: boolean = true
  ): Promise<PaginatedResponse<Recipe>> {
    return this.searchRecipes({ 
      authorUsername, 
      page, 
      pageSize, 
      enableCache 
    });
  }

  /**
   * Search recipes by author
   */
  async searchRecipesByAuthor(
    authorUsername: string,
    query: string,
    page: number = 1,
    pageSize: number = 20,
    enableCache: boolean = true
  ): Promise<PaginatedResponse<Recipe>> {
    return this.searchRecipes({ 
      authorUsername, 
      query, 
      page, 
      pageSize, 
      enableCache 
    });
  }

  /**
   * Get single recipe by slug
   */
  async getRecipeBySlug(slug: string): Promise<Recipe> {
    try {
      const response = await this.fetchWithAuth(`${API_URL}recipes/${encodeURIComponent(slug)}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching recipe:', error);
      throw error;
    }
  }

  /**
   * Create a new recipe
   */
  async createRecipe(recipeData: any): Promise<Recipe> {
    try {
      const response = await this.fetchWithAuth(`${API_URL}generate-recipe`, {
        method: "POST",
        body: JSON.stringify(recipeData),
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating recipe:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const recipeApiService = new RecipeApiService();

// Export the class for testing purposes
export { RecipeApiService };
