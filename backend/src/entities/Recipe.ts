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

export interface Recipe {
  Name: string;
  Slug: string;
  Instructions: string;
  Servings: number;
  DishType: DishType;
  Ingredients: string[];
  IngredientQuantities: string[];
  IngredientUnits: string[];
  CompatibleIntolerances: string[];
  PrepTime: number;
  Difficulty: Difficulty;
  Tags: string[];
  CreatedAt: Date;
  isPrivate: boolean;
  Author: string;
}
