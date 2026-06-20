import mongoose, {
  HydratedDocument,
  InferSchemaType,
} from "mongoose";

const pricingSchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    countryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
      required: true,
    },

    minPrice: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    maxPrice: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    isConfigured: {
      type: Boolean,
      default: false,
    },
  },
  {
    strict: true,
    timestamps: true,
    versionKey: false,
  },
);

pricingSchema.index(
  {
    categoryId: 1,
    countryId: 1,
  },
  {
    unique: true,
  },
);

export type TPricing = InferSchemaType<typeof pricingSchema>;

pricingSchema.pre(
  "validate",
  async function (this: HydratedDocument<TPricing>) {
    if (this.maxPrice < this.minPrice) {
      throw new Error(
        "Maximum price must be greater than or equal to minimum price",
      );
    }
  },
);

export const Pricing =
  mongoose.models.Pricing || mongoose.model("Pricing", pricingSchema);
