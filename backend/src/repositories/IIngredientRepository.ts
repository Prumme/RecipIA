import { Ingredient } from "../entities/Ingredient";

export interface IIngredientRepository {
  create(ingredient: Ingredient): Promise<Ingredient>;
  findByName(query: { name: string }): Promise<Ingredient | null>;
  //findByRecipeId(recipeId: string): Promise<Ingredient[]>;
}
