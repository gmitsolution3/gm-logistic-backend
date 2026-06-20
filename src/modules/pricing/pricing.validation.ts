import { z } from "zod";

const updatePricingValidationSchema =
  z.object({
    body: z
      .object({
        minPrice: z
          .number()
          .min(0),

        maxPrice: z
          .number()
          .min(0),
      })
      .refine(
        (data) =>
          data.maxPrice >= data.minPrice,
        {
          path: ["maxPrice"],
          message:
            "Maximum price must be greater than or equal to minimum price",
        },
      ),
  });

export const PricingValidation = {
  updatePricingValidationSchema,
};