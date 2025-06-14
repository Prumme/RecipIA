import { z } from "zod";
import { DishType, Difficulty, Tags } from "../../entities/Recipe";

export const postRecipeRequest = z.object({
  Name: z.string().min(1).max(100),
  Slug: z.string().min(1).max(100),
  Instructions: z.string().min(1),
  Servings: z.number().int().positive(),
  DishType: z.nativeEnum(DishType),
  Ingredients: z.array(z.string()).nonempty(),
  PrepTime: z.number().int().nonnegative(),
  Difficulty: z.nativeEnum(Difficulty),
  Tags: z.array(z.nativeEnum(Tags)).default([]),
  Image: z.array(z.any()).optional(),
  Compositions: z.array(z.string()),
  Private: z.boolean(),
  Author: z.array(z.string()),
});
