import { z } from "zod";
import { IngredientCategory, Intolerance } from "../../entities/Ingredient";

export const ingredientRequest = z.object({
  Name: z.string().min(1).max(100),
  Slug: z.string().min(1).max(100),
  Category: z.nativeEnum(IngredientCategory),
  NutritionalValues: z.object({
    calories: z.number(),
    protein: z.number(),
    carbohydrates: z.number(),
    fat: z.number(),
    vitamins: z.record(z.string(), z.number()),
    minerals: z.record(z.string(), z.number()),
  }),
  Intolerances: z.array(z.nativeEnum(Intolerance)).optional(),
  Image: z.array(z.any()).optional(), // Assuming Image can be any type, adjust as needed
});
