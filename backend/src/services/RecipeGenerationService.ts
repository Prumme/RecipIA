import {
  IAIRecipeService,
  GenerateRecipeParams,
} from "../ai/interfaces/IAIRecipeService";
import { AirtableRecipeRepository } from "../airtable/AirtableRecipeRepository";
import { AirtableIngredientRepository } from "../airtable/AirtableIngredientRepository";
import { AirtableCompositionRepository } from "../airtable/AirtableCompositionRepository";
import { AirtableUserRepository } from "../airtable/AirtableUserRepository";
import { Recipe, DishType, Difficulty, Tags } from "../entities/Recipe";
import { AirtableResult } from "../airtable/AirtableResult";
import { BraveImageSearchService } from "./BraveImageSearchService";

export class RecipeGenerationService {
  constructor(
    private aiRecipeService: IAIRecipeService,
    private recipeRepository: AirtableRecipeRepository,
    private ingredientRepository: AirtableIngredientRepository,
    private compositionRepository: AirtableCompositionRepository,
    private userRepository: AirtableUserRepository,
    private imageSearchService: BraveImageSearchService
  ) {}

  async generateAndSaveRecipe(
    params: GenerateRecipeParams,
    authorUsername: string
  ): Promise<AirtableResult<Recipe>> {
    try {
      // 1. Generate recipe with AI
      console.log("Generating recipe with AI...");
      const aiRecipeData = await this.aiRecipeService.generateRecipe(params);
      console.log("AI Recipe generated:", aiRecipeData.Name);

      // Check if author exists
      const author = await this.userRepository.findByUsername({
        username: authorUsername,
      });
      if (!author) {
        console.error(`Author with username ${authorUsername} not found`);
        throw new Error(`Author with username ${authorUsername} not found`);
      }
      const authorId = author._airtableId;

      // 2. Process ingredients - create missing ones
      console.log("Processing ingredients...");
      const ingredientId: string[] = [];

      for (const aiIngredient of aiRecipeData.ingredients) {
        let ingredient = await this.ingredientRepository.findByName({
          name: aiIngredient.Slug,
        });

        if (!ingredient) {
          console.log(`Creating new ingredient: ${aiIngredient.Name}`);
          const ingredientImageUrl =
            await this.imageSearchService.searchIngredientImage(
              aiIngredient.Name
            );

          console.log(`Ingredient image URL found: ${ingredientImageUrl}`);

          // Wait 1.1 seconds to respect API rate limit (1 call/second)
          await new Promise(resolve => setTimeout(resolve, 1100));

          // Direct mapping - no conversion needed!
          const { quantity, unit, ...ingredientData } = aiIngredient;
          const ingredientToCreate = {
            ...ingredientData,
            ...(ingredientImageUrl && { Image: [{ url: ingredientImageUrl }] }),
          };
          ingredient = await this.ingredientRepository.create(
            ingredientToCreate
          );
        }

        ingredientId.push(ingredient._airtableId);
      }

      // 3. Create recipe following your existing structure
      console.log("Creating recipe...");

      // Wait before recipe image search to respect API rate limit
      await new Promise(resolve => setTimeout(resolve, 1100));

      const recipeImageUrl = await this.imageSearchService.searchRecipeImage(
        aiRecipeData.Name
      );

      console.log(`Recipe image URL found: ${recipeImageUrl}`);

      const recipe = await this.recipeRepository.create({
        Name: aiRecipeData.Name,
        Slug: aiRecipeData.Slug,
        Instructions: aiRecipeData.Instructions.join("\n\n"),
        Servings: aiRecipeData.Servings,
        DishType: aiRecipeData.DishType as DishType,
        Ingredients: ingredientId,
        PrepTime: aiRecipeData.PrepTime,
        Difficulty: aiRecipeData.Difficulty as Difficulty,
        Tags: aiRecipeData.Tags as Tags[],
        Image: recipeImageUrl ? ([{ url: recipeImageUrl }] as any) : [],
        Compositions: [],
        Private: false,
        Author: [authorId],
      });

      // 4. Create compositions
      console.log("Creating compositions...");
      for (let i = 0; i < aiRecipeData.ingredients.length; i++) {
        const aiIngredient = aiRecipeData.ingredients[i];
        const ingredientIdListItem = ingredientId[i];

        await this.compositionRepository.create({
          Recipe: [recipe._airtableId],
          Ingredient: [ingredientIdListItem],
          Quantity: aiIngredient.quantity,
          Unit: aiIngredient.unit,
        });
      }

      // 5. Return complete recipe
      console.log("Recipe generation completed successfully");
      const generatedRecipe = await this.recipeRepository.findBySlug({
        slug: recipe.Slug,
        cache: false,
      });
      if (!generatedRecipe) {
        console.error("Generated recipe not found after creation");
        throw new Error("Generated recipe not found after creation");
      }

      return generatedRecipe;
    } catch (error) {
      console.error("Error in recipe generation:", error);
      throw error;
    }
  }
}
