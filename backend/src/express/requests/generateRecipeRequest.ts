import { z } from "zod";
import { Tags } from "../../entities/Recipe";

export const generateRecipeRequest = z.object({
  tags: z.array(z.nativeEnum(Tags)).default([]),
  ingredients: z
    .array(z.string())
    .min(1, "At least one ingredient is required"),
  intolerances: z.array(z.string()).default([]),
  numberOfPersons: z
    .number()
    .int()
    .min(1)
    .max(20, "Number of persons must be between 1 and 20"),
  dishType: z
    .enum(["Appetizer", "Main Course", "Dessert", "Snack"])
    .default("Main Course"),
});
