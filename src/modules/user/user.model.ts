import mongoose, {
  InferSchemaType,
} from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    image: {
      type: String,
      default: "",
    },

    imagePublicId: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
      index: true,
    },

    isBanned: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,

    // IMPORTANT:
    // Better Auth stores users in "user"
    collection: "user",
  },
);

export type TUser = InferSchemaType<
  typeof userSchema
>;

export const User =
  mongoose.models.User ||
  mongoose.model("User", userSchema);