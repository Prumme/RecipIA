import { PaginatedCollection } from "../types/PaginatedCollection";
import { RecipeListItem } from "../entities/Recipe";

export interface IRecipeListRepository {
  findAll(query: {
    search?: string;
  }): Promise<PaginatedCollection<RecipeListItem>>;
  findByAuthor(query: {
    authorUsername: string;
    search?: string;
  }): Promise<PaginatedCollection<RecipeListItem>>;
}
