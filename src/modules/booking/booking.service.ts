import status from "http-status";

import { BOOKING_MESSAGES } from "./booking.constant";
import { Booking } from "./booking.model";
import { TCreateBookingPayload } from "./booking.types";

import { Country } from "../country/country.model";
import { Pricing } from "../pricing/pricing.model";
import { User } from "../user/user.model";

import { AppError } from "../../utils/AppError";
import { validateObjectId } from "../../utils/validateObjectId";

import { TPaginationOptions } from "../../types/common";
import { calculatePagination } from "../../utils/calculatePagination";
import { TBookingFilters, TUpdateBookingStatusPayload } from "./booking.types";

const createBooking = async (payload: TCreateBookingPayload) => {
  validateObjectId(payload.userId, "User");

  validateObjectId(payload.fromCountry, "From Country");

  validateObjectId(payload.toCountry, "To Country");

  validateObjectId(payload.categoryPricing, "Pricing");

  const existingTrackingId = await Booking.findOne({
    trackingId: payload.trackingId,
  });

  if (existingTrackingId) {
    throw new AppError(
      status.CONFLICT,
      BOOKING_MESSAGES.TRACKING_ID_EXISTS,
    );
  }

  const [user, fromCountry, toCountry, pricing] = await Promise.all([
    User.findById(payload.userId),

    Country.findById(payload.fromCountry),

    Country.findById(payload.toCountry),

    Pricing.findById(payload.categoryPricing),
  ]);

  if (!user) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  if (!fromCountry) {
    throw new AppError(status.NOT_FOUND, "From country not found");
  }

  if (!toCountry) {
    throw new AppError(status.NOT_FOUND, "To country not found");
  }

  if (!pricing) {
    throw new AppError(status.NOT_FOUND, "Pricing not found");
  }

  const booking = await Booking.create(payload);

  return booking;
};

const getAllBookings = async (
  filters: TBookingFilters,
  paginationOptions: TPaginationOptions,
) => {
  const query: Record<string, unknown> = {};

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.userId) {
    query.userId = filters.userId;
  }

  if (filters.searchTerm) {
    query.trackingId = {
      $regex: filters.searchTerm,
      $options: "i",
    };
  }

  const { page, limit, skip } =
    calculatePagination(paginationOptions);

  const total = await Booking.countDocuments(query);

  const bookings = await Booking.find(query)
    .populate("userId", "name email role")
    .populate("fromCountry", "name code warehouse")
    .populate("toCountry", "name code warehouse")
    .populate("categoryPricing")
    .sort({
      createdAt: -1,
    })
    .skip(skip)
    .limit(limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },

    result: bookings,
  };
};

const getSingleBooking = async (id: string) => {
  validateObjectId(id, "Booking");

  const booking = await Booking.findById(id)
    .populate("userId", "name email phone role image")
    .populate("fromCountry", "name code currency warehouse")
    .populate("toCountry", "name code currency warehouse")
    .populate("categoryPricing");

  if (!booking) {
    throw new AppError(status.NOT_FOUND, BOOKING_MESSAGES.NOT_FOUND);
  }

  return booking;
};

const updateBookingStatus =
  async (
    id: string,
    payload: TUpdateBookingStatusPayload,
  ) => {
    validateObjectId(
      id,
      "Booking",
    );

    const booking =
      await Booking.findById(id);

    if (!booking) {
      throw new AppError(
        status.NOT_FOUND,
        BOOKING_MESSAGES.NOT_FOUND,
      );
    }

    booking.status =
      payload.status;

    await booking.save();

    return booking;
  };

export const BookingService = {
  createBooking,
  getAllBookings,
  getSingleBooking,
  updateBookingStatus,
};
