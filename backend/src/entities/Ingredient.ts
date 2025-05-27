import { Intolerance } from "./Intolerance";

export enum IngredientCategory {
  Fruits = "Fruits",
  Vegetables = "Vegetables",
  GrainsCereals = "Grains & Cereals",
  LegumesPulses = "Legumes & Pulses",
  DairyAlternatives = "Dairy & Alternatives",
  MeatPoultry = "Meat & Poultry",
  FishSeafood = "Fish & Seafood",
  Eggs = "Eggs",
  NutsSeeds = "Nuts & Seeds",
  FatsOils = "Fats & Oils",
  HerbsSpices = "Herbs & Spices",
}

export interface Ingredient {
  Name: string;
  Category: IngredientCategory;
  NutritionalValues: string;
  Intolerances: Intolerance[];
}
