import mongoose, { InferSchemaType, Model } from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    value: {
      type: String,
      required: [true, "Category value is required"],
      trim: true,
      lowercase: true,
      unique: true,
    },

    label: {
      type: String,
      required: [true, "Category label is required"],
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Unique slug value
 * Example:
 * electronics
 * cosmetics
 * fashion
 */
categorySchema.index({ value: 1 }, { unique: true });

export type CategoryType = InferSchemaType<typeof categorySchema>;

export interface ICategory extends CategoryType {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const Category: Model<ICategory> =
  mongoose.models.Category ||
  mongoose.model<ICategory>("Category", categorySchema);

export default Category;