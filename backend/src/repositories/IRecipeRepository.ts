import { Recipe, FieldToCreateRecipe } from "../entities/Recipe";

export interface IRecipeRepository {
  findBySlug(query: { slug: string }): Promise<Recipe | null>;
  create(recipe: FieldToCreateRecipe): Promise<Recipe>;
  updateRecipePrivacy(query: {
    slug: string;
    private: boolean;
  }): Promise<Recipe | null>;
}
