export const BOOKING_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export const DELIVERY_LOCATION = {
  OFFICE: "office",
  CUSTOM: "custom",
} as const;

export const TRANSPORTATION_METHOD = {
  AIR: "air",
  SEA: "sea",
  BY_HAND: "by-hand",
} as const;

export const SERVICE_TYPE = {
  IMPORT: "import",
  EXPORT: "export",
} as const;

export const BOOKING_MESSAGES = {
  CREATED: "Booking created successfully",
  RETRIEVED: "Bookings retrieved successfully",
  SINGLE_RETRIEVED: "Booking retrieved successfully",
  UPDATED: "Booking updated successfully",

  NOT_FOUND: "Booking not found",

  TRACKING_ID_EXISTS: "Tracking ID already exists",

  INVALID_PRICE_RANGE:
    "Price range maximum must be greater than or equal to minimum",

  INVALID_SHIPPING_CHARGE_RANGE:
    "Estimated shipping charge maximum must be greater than or equal to minimum",

  STATUS_UPDATED: "Booking status updated successfully",
};
