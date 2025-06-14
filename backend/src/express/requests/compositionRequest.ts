import { z } from "zod";

export const compositionRequest = z.object({
  Recipe: z.array(z.string()).nonempty(),
  Ingredient: z.array(z.string()).nonempty(),
  Quantity: z.number().int().nonnegative(),
  Unit: z.string().max(50),
});
