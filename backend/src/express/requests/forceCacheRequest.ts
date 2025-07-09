import { z } from "zod";

export const forceCacheRequest = z.object({
  cache: z
    .union([
      z.coerce.boolean(),
      z.string().transform((val) => val.toLowerCase() === "true"),
    ])
    .optional()
    .default(true),
});
