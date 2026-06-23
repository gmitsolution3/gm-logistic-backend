import { z } from "zod";

import {
  BOOKING_STATUS,
  DELIVERY_LOCATION,
  SERVICE_TYPE,
  TRANSPORTATION_METHOD,
} from "./booking.constant";

const rangeSchema = z
  .object({
    min: z.number({
      error: "Minimum value is required",
    }),

    max: z.number({
      error: "Maximum value is required",
    }),
  })
  .refine((data) => data.max >= data.min, {
    message:
      "Maximum value must be greater than or equal to minimum value",
    path: ["max"],
  });

const deliveryAddressSchema = z.object({
  districtName: z
    .string({
      error: "District name is required",
    })
    .trim()
    .min(1),

  thana: z
    .string({
      error: "Thana is required",
    })
    .trim()
    .min(1),

  city: z
    .string({
      error: "City is required",
    })
    .trim()
    .min(1),

  address: z
    .string({
      error: "Address is required",
    })
    .trim()
    .min(1),
});

const createBookingValidationSchema = z.object({
  body: z
    .object({
      userId: z
        .string({
          error: "User id is required",
        })
        .trim(),

      trackingId: z
        .string({
          error: "Tracking ID is required",
        })
        .trim(),

      fromCountry: z
        .string({
          error: "From country is required",
        })
        .trim(),

      toCountry: z
        .string({
          error: "To country is required",
        })
        .trim(),

      categoryPricing: z
        .string({
          error: "Category pricing is required",
        })
        .trim(),

      itemName: z
        .string({
          error: "Item name is required",
        })
        .trim()
        .min(1),

      totalCarton: z
        .number({
          error: "Total carton is required",
        })
        .min(1),

      totalQuantity: z
        .number({
          error: "Total quantity is required",
        })
        .min(1),

      totalWeight: z
        .number({
          error: "Total weight is required",
        })
        .min(0),

      priceRange: rangeSchema,

      estimatedShippingCharge: rangeSchema,

      serviceType: z.enum(
        Object.values(SERVICE_TYPE) as [string, ...string[]],
      ),

      transportationMethod: z.enum(
        Object.values(TRANSPORTATION_METHOD) as [string, ...string[]],
      ),

      shippingMark: z
        .string({
          error: "Shipping mark is required",
        })
        .trim(),

      deliveryLocation: z.enum(
        Object.values(DELIVERY_LOCATION) as [string, ...string[]],
      ),

      deliveryAddress: deliveryAddressSchema.optional(),

      note: z.string().trim().optional(),

      status: z.enum(
        Object.values(BOOKING_STATUS) as [string, ...string[]],
      ),
    })
    .superRefine((data, ctx) => {
      if (
        data.deliveryLocation === DELIVERY_LOCATION.CUSTOM &&
        !data.deliveryAddress
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,

          path: ["deliveryAddress"],

          message: "Delivery address is required for custom delivery",
        });
      }
    }),
});

const updateBookingStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(
      Object.values(BOOKING_STATUS) as [string, ...string[]],
    ),
  }),
});

export const BookingValidation = {
  createBookingValidationSchema,
  updateBookingStatusValidationSchema
};
