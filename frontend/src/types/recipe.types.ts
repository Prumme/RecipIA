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
}

export interface Ingredient {
  IngredientsName: string;
  IngredientsQuantity: string;
  IngredientsUnit?: string;
  IngredientsImages?: { url: string };
}
