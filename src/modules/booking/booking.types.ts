import {
  BOOKING_STATUS,
  DELIVERY_LOCATION,
  SERVICE_TYPE,
  TRANSPORTATION_METHOD,
} from "./booking.constant";

export type TBookingStatus =
  (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS];

export type TDeliveryLocation =
  (typeof DELIVERY_LOCATION)[keyof typeof DELIVERY_LOCATION];

export type TTransportationMethod =
  (typeof TRANSPORTATION_METHOD)[keyof typeof TRANSPORTATION_METHOD];

export type TServiceType =
  (typeof SERVICE_TYPE)[keyof typeof SERVICE_TYPE];

export type TRange = {
  min: number;
  max: number;
};

export type TDeliveryAddress = {
  districtName: string;
  thana: string;
  city: string;
  address: string;
};

export type TCreateBookingPayload = {
  userId: string;

  trackingId: string;

  fromCountry: string;
  toCountry: string;

  categoryPricing: string;

  itemName: string;

  totalCarton: number;
  totalQuantity: number;
  totalWeight: number;

  priceRange: TRange;

  estimatedShippingCharge: TRange;

  serviceType: TServiceType;

  transportationMethod: TTransportationMethod;

  shippingMark: string;

  deliveryLocation: TDeliveryLocation;

  deliveryAddress?: TDeliveryAddress;

  note?: string;

  status: TBookingStatus;
};

export type TUpdateBookingStatusPayload = {
  status: TBookingStatus;
};

export type TBookingFilters = {
  searchTerm?: string;
  status?: string;
  userId?: string;
};
