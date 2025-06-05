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

export interface NutritionalValues {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  vitamins: Record<string, number>;
  minerals: Record<string, number>;
}

export interface Ingredient {
  Name: string;
  Slug: string;
  Category: IngredientCategory;
  NutritionalValues: NutritionalValues;
  Intolerances: Intolerance[];
  Image?: string[];
}
