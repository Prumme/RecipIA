export enum DishType {
  Appetizer = "Appetizer",
  MainCourse = "Main Course",
  Dessert = "Dessert",
  Snack = "Snack",
}

export enum Difficulty {
  Easy = "Easy",
  Medium = "Medium",
  Hard = "Hard",
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

export interface RecipeImage {
  filename: string;
  url: string;
  thumbnails?: Record<"small" | "large" | "full", { url?: string } | undefined>;
}

export interface Recipe {
  Name: string;
  Slug: string;
  Instructions: string;
  Servings: number;
  DishType: DishType;
  Ingredients: string[];
  IngredientsName: string[];
  PrepTime: number;
  Difficulty: Difficulty;
  Tags: Tags[];
  CreatedAt: string;
  Intolerances: string[];
  Image: RecipeImage[];
  Compositions: string[];
  IngredientsQuantity: number[];
  IngredientsUnit: string[];
  NutritionalValues: string[];
  Private: boolean;
  Author: string[];
  AuthorName: string[];
}

export type RecipeListItem = Omit<
  Recipe,
  | "Instructions"
  | "IngredientsName"
  | "Ingredients"
  | "Private"
  | "CreatedAt"
  | "Compositions"
  | "IngredientsQuantity"
  | "IngredientsUnit"
  | "Author"
  | "NutritionalValues"
>;

export type FieldToCreateRecipe = Omit<
  Recipe,
  | "CreatedAt"
  | "IngredientsName"
  | "IngredientsQuantity"
  | "IngredientsUnit"
  | "AuthorName"
  | "Intolerances"
  | "Image"
  | "NutritionalValues"
>;
