import mongoose, { InferSchemaType, Schema } from "mongoose";

import { OTP_PURPOSE } from "./otp.constant";

const otpSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    otp: {
      type: String,
      required: true,
      trim: true,
    },

    purpose: {
      type: String,
      enum: Object.values(OTP_PURPOSE),
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,

      // MongoDB TTL Index
      expires: 0,
    },

    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Fast lookup when verifying OTP
otpSchema.index(
  {
    email: 1,
    purpose: 1,
  },
  {
    unique: true,
  },
);

// Automatically remove expired OTPs
otpSchema.index({
  expiresAt: 1,
});

export type TOtp = InferSchemaType<typeof otpSchema>;

export const Otp =
  mongoose.models.Otp || mongoose.model("Otp", otpSchema);
