import { IngredientCategory, Intolerance } from "../../entities/Ingredient";

export interface AIIngredientData {
  Name: string;
  Slug: string;
  Category: IngredientCategory;
  NutritionalValues: {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
    vitamins: Record<string, number>;
    minerals: Record<string, number>;
  };
  Intolerances: Intolerance[];
  Image?: any[];
  // For composition
  quantity: number;
  unit: string;
}

export interface AIRecipeData {
  Name: string;
  Slug: string;
  Instructions: string[];
  Servings: number;
  DishType: string;
  PrepTime: number;
  Difficulty: "Easy" | "Medium" | "Hard";
  Tags: string[];
  Image?: any[];
  ingredients: AIIngredientData[];
}

export interface GenerateRecipeParams {
  tags: string[];
  ingredients: string[];
  intolerances: string[];
  numberOfPersons: number;
  dishType: string;
}

export interface IAIRecipeService {
  generateRecipe(params: GenerateRecipeParams): Promise<AIRecipeData>;
}
