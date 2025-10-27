import { z } from "zod";

export const zStringEmptyOptional = (schema: z.ZodString = z.string()) =>
  schema
    .refine(() => true) // no-op refine to keep schema chainable
    .transform((val) => (val.trim() === "" ? undefined : val))
    .optional();
