import { z } from "zod";

import { OTP_PURPOSE } from "./otp.constant";

const sendOtpValidationSchema =
  z.object({
    body: z.object({
      email: z
        .string({
          error:
            "Email is required",
        })
        .email(),

      purpose: z.enum(
        Object.values(
          OTP_PURPOSE,
        ) as [
          string,
          ...string[],
        ],
      ),
    }),
  });

const verifyOtpValidationSchema =
  z.object({
    body: z.object({
      email: z
        .string({
          error:
            "Email is required",
        })
        .email(),

      otp: z
        .string({
          error:
            "OTP is required",
        })
        .regex(
          /^\d{6}$/,
          "OTP must be a 6 digit number",
        ),

      purpose: z.enum(
        Object.values(
          OTP_PURPOSE,
        ) as [
          string,
          ...string[],
        ],
      ),
    }),
  });

export const OtpValidation = {
  sendOtpValidationSchema,
  verifyOtpValidationSchema,
};