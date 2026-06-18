import { z } from "zod";

const createCountryValidationSchema = z.object({
  body: z.object({
    name: z.string({
      error: "Country name is required",
    }),

    code: z.string({
      error: "Country code is required",
    }),

    currency: z.string({
      error: "Currency is required",
    }),
  }),
});

const updateCountryValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),

    code: z.string().optional(),

    currency: z.string().optional(),

    isActive: z.boolean().optional(),
  }),
});

const updateCountryStatusValidationSchema = z.object({
  body: z.object({
    isActive: z.boolean({
      error: "isActive is required",
    }),
  }),
});

export const CountryValidation = {
  createCountryValidationSchema,
  updateCountryValidationSchema,
  updateCountryStatusValidationSchema,
};