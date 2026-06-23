import mongoose, {
  InferSchemaType,
  Schema,
  HydratedDocument
} from "mongoose";

import {
  BOOKING_STATUS,
  DELIVERY_LOCATION,
  SERVICE_TYPE,
  TRANSPORTATION_METHOD,
} from "./booking.constant";

const rangeSchema = new Schema(
  {
    min: {
      type: Number,
      required: true,
      min: 0,
    },

    max: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
    versionKey: false,
  },
);

const deliveryAddressSchema = new Schema(
  {
    districtName: {
      type: String,
      required: true,
      trim: true,
    },

    thana: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
    versionKey: false,
  },
);

const bookingSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    trackingId: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
      index: true,
      trim: true,
    },

    fromCountry: {
      type: Schema.Types.ObjectId,
      ref: "Country",
      required: true,
    },

    toCountry: {
      type: Schema.Types.ObjectId,
      ref: "Country",
      required: true,
    },

    categoryPricing: {
      type: Schema.Types.ObjectId,
      ref: "Pricing",
      required: true,
    },

    itemName: {
      type: String,
      required: true,
      trim: true,
    },

    totalCarton: {
      type: Number,
      required: true,
      min: 1,
    },

    totalQuantity: {
      type: Number,
      required: true,
      min: 1,
    },

    totalWeight: {
      type: Number,
      required: true,
      min: 0,
    },

    priceRange: {
      type: rangeSchema,
      required: true,
    },

    estimatedShippingCharge: {
      type: rangeSchema,
      required: true,
    },

    serviceType: {
      type: String,
      enum: Object.values(SERVICE_TYPE),
      required: true,
    },

    transportationMethod: {
      type: String,
      enum: Object.values(TRANSPORTATION_METHOD),
      required: true,
    },

    shippingMark: {
      type: String,
      required: true,
      trim: true,
    },

    deliveryLocation: {
      type: String,
      enum: Object.values(DELIVERY_LOCATION),
      required: true,
    },

    deliveryAddress: {
      type: deliveryAddressSchema,
    },

    note: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: Object.values(BOOKING_STATUS),
      default: BOOKING_STATUS.PENDING,
    },
  },
  {
    strict: true,
    timestamps: true,
    versionKey: false,
  },
);

bookingSchema.index({
  trackingId: 1,
});

bookingSchema.index({
  userId: 1,
});

bookingSchema.index({
  status: 1,
});

bookingSchema.index({
  createdAt: -1,
});

bookingSchema.index({
  userId: 1,
  createdAt: -1,
});

export type TBooking = InferSchemaType<typeof bookingSchema>;

bookingSchema.pre("validate", function (this: HydratedDocument<TBooking>) {
  if (this.priceRange.max < this.priceRange.min) {
    throw new Error(
        "Price range maximum must be greater than or equal to minimum",
      );
  }

  if (
    this.estimatedShippingCharge.max <
    this.estimatedShippingCharge.min
  ) {
    throw new Error(
        "Estimated shipping charge maximum must be greater than or equal to minimum",
      );
  }

  if (
    this.deliveryLocation === DELIVERY_LOCATION.CUSTOM &&
    !this.deliveryAddress
  ) {
    throw new Error("Delivery address is required for custom delivery");
  }

});

export const Booking =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
