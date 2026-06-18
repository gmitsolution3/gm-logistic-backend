import { z } from "zod";

const createCategoryValidationSchema = z.object({
  body: z.object({
    label: z
      .string({
        message: "Category label is required",
      })
      .min(1, "Category label is required"),
  }),
});

const updateCategoryValidationSchema = z.object({
  body: z.object({
    label: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});

const updateCategoryStatusValidationSchema = z.object({
  body: z.object({
    isActive: z.boolean({
      message: "isActive is required",
    }),
  }),
});

export const CategoryValidation = {
  createCategoryValidationSchema,
  updateCategoryValidationSchema,
  updateCategoryStatusValidationSchema,
};