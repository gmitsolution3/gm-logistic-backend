import { z } from "zod";

const updateUserRoleValidationSchema = z.object({
  body: z.object({
    role: z.enum(["admin", "user"]),
  }),
});

const updateUserBanStatusValidationSchema = z.object({
  body: z.object({
    isBanned: z.boolean({
      error: "isBanned is required",
    }),
  }),
});

const updateEmailVerificationValidationSchema =
  z.object({
    body: z.object({
      email: z
        .string({
          error: "Email is required",
        })
        .email(),

      emailVerified: z.boolean({
        error:
          "Email verification status is required",
      }),
    }),
  });

export const UserValidation = {
  updateUserRoleValidationSchema,
  updateUserBanStatusValidationSchema,
  updateEmailVerificationValidationSchema
};
