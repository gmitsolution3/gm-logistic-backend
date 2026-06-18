import mongoose, { InferSchemaType, Model } from "mongoose";

const countrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Country name is required"],
      trim: true,
      unique: true,
    },

    code: {
      type: String,
      required: [true, "Country code is required"],
      trim: true,
      uppercase: true,
      unique: true,
    },

    currency: {
      type: String,
      required: [true, "Currency is required"],
      trim: true,
      uppercase: true,
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
 * Indexes
 * - Fast lookup by country name
 * - Fast lookup by country code
 */
countrySchema.index({ name: 1 }, { unique: true });
countrySchema.index({ code: 1 }, { unique: true });

export type CountryType = InferSchemaType<typeof countrySchema>;

export interface ICountry extends CountryType {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const Country: Model<ICountry> =
  mongoose.models.Country ||
  mongoose.model<ICountry>("Country", countrySchema);

export default Country;