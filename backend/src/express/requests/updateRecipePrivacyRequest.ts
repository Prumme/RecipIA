import { z } from "zod";

export const updateRecipePrivacyRequest = z.object({
  private: z.boolean(),
});
