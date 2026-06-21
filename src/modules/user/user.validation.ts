import { z } from "zod";

const updateUserRoleValidationSchema =
  z.object({
    body: z.object({
      role: z.enum([
        "admin",
        "user",
      ]),
    }),
  });

const updateUserBanStatusValidationSchema =
  z.object({
    body: z.object({
      isBanned: z.boolean({
        error:
          "isBanned is required",
      }),
    }),
  });

export const UserValidation = {
  updateUserRoleValidationSchema,
  updateUserBanStatusValidationSchema,
};