import { PaginatedCollection } from "../types/PaginatedCollection";
import { RecipeListItem } from "../entities/Recipe";

export interface IRecipeListRepository {
  findAll(query: {
    page: number;
    pageSize: number;
    search?: string;
    cache?: boolean;
  }): Promise<PaginatedCollection<RecipeListItem>>;
  findByAuthor(query: {
    authorUsername: string;
    page: number;
    pageSize: number;
    search?: string;
    cache?: boolean;
  }): Promise<PaginatedCollection<RecipeListItem>>;
}
