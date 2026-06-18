import mongoose, {
  CallbackError,
  HydratedDocument,
  InferSchemaType,
  Model,
} from "mongoose";

const pricingSchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },

    countryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
      required: [true, "Country is required"],
    },

    minPrice: {
      type: Number,
      required: [true, "Minimum price is required"],
      min: [0, "Minimum price cannot be negative"],
    },

    maxPrice: {
      type: Number,
      required: [true, "Maximum price is required"],
      min: [0, "Maximum price cannot be negative"],
    },

    isConfigured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

/**
 * Prevent duplicate pricing configuration
 * for same category + country pair
 */
pricingSchema.index(
  {
    categoryId: 1,
    countryId: 1,
  },
  {
    unique: true,
  },
);

/**
 * Validation:
 * maxPrice >= minPrice
 */
pricingSchema.pre(
  "validate" as any,
  function (
    this: HydratedDocument<IPricing>,
    next: (err?: CallbackError) => void,
  ) {
    if (this.maxPrice < this.minPrice) {
      return next(
        new Error(
          "maxPrice must be greater than or equal to minPrice",
        ),
      );
    }

    next();
  },
);

export type PricingType = InferSchemaType<typeof pricingSchema>;

export interface IPricing extends PricingType {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const Pricing: Model<IPricing> =
  mongoose.models.Pricing ||
  mongoose.model<IPricing>("Pricing", pricingSchema);

export default Pricing;
