export type Difficulty = "Easy" | "Medium" | "Hard";

export enum DishType {
  MainCourse = "Main Course",
  Appetizer = "Appetizer",
  Dessert = "Dessert",
  Snack = "Snack",
}

export enum Tags {
  Vegan = "Vegan",
  GlutenFree = "Gluten Free",
  DairyFree = "Dairy Free",
  NutFree = "Nut Free",
  LowCarb = "Low Carb",
  HighProtein = "High Protein",
  Quick = "Quick",
  Healthy = "Healthy",
  Seasonal = "Seasonal",
  NoOven = "No Oven",
}

export enum Intolerance {
  Gluten = "Gluten",
  Lactose = "Lactose",
  Nuts = "Nuts",
  Soy = "Soy",
  Eggs = "Eggs",
  Seafood = "Seafood",
  Sesame = "Sesame",
  Sulfites = "Sulfites",
  Dairy = "Dairy",
  Nightshades = "Nightshades",
}

export interface Recipe {
  Name: string;
  Servings: number;
  DishType: DishType;
  Ingredients: Ingredient[];
  IngredientsName: string[];
  IngredientsQuantity: string[];
  IngredientsUnit: string[];
  IngredientsImages: { url: string }[];
  Intolerances: Intolerance[];
  PrepTime: number;
  Difficulty: Difficulty;
  Tags: Tags[];
  Slug: string;
  Instructions: string;
  NutritionalValues?: string[]; // Valeurs JSON nutritionnelles par ingrédient
}

export interface Ingredient {
  IngredientsName: string;
  IngredientsQuantity: string;
  IngredientsUnit?: string;
  IngredientsImages?: { url: string };
}

// ===== NUTRITIONAL VALUES INTERFACES =====

export interface NutritionalValues {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  vitamins: Record<string, number>;
  minerals: Record<string, number>;
}

export interface IngredientNutrition {
  ingredientName: string;
  quantity: number;
  unit: string;
  nutritionalValues: NutritionalValues;
  calculatedValues: NutritionalValues; // Valeurs calculées selon la quantité réelle
}

export interface RecipeNutrition {
  totalValues: NutritionalValues; // Valeurs totales de la recette
  perServing: NutritionalValues; // Valeurs par portion
  ingredients: IngredientNutrition[]; // Détail par ingrédient
}

// Types pour les unités de mesure nutritionnelles
export type NutritionUnit = "g" | "ml" | "item" | "cup" | "tablespoon" | "teaspoon";

// Interface étendue de Recipe pour inclure les valeurs nutritionnelles
export interface RecipeWithNutrition extends Recipe {
  NutritionalValues: string[]; // Les valeurs JSON stringifiées comme vous les recevez
  nutrition?: RecipeNutrition; // Les valeurs calculées (optionnel, calculé côté client)
}
