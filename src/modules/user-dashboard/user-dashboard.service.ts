import status from "http-status";

import { Booking } from "../booking/booking.model";

import { AppError } from "../../utils/AppError";
import { validateObjectId } from "../../utils/validateObjectId";

const getDashboardData = async (
  userId: string,
) => {
  validateObjectId(userId, "User");

  const [
    totalBookings,
    pendingBookings,
    processingBookings,
    shippedBookings,
    completedBookings,
    cancelledBookings,

    recentBookings,

    latestBooking,
  ] = await Promise.all([
    Booking.countDocuments({
      userId,
    }),

    Booking.countDocuments({
      userId,
      status: "pending",
    }),

    Booking.countDocuments({
      userId,
      status: "processing",
    }),

    Booking.countDocuments({
      userId,
      status: "shipped",
    }),

    Booking.countDocuments({
      userId,
      status: "completed",
    }),

    Booking.countDocuments({
      userId,
      status: "cancelled",
    }),

    Booking.find({
      userId,
    })
      .populate(
        "fromCountry",
        "name code",
      )
      .populate(
        "toCountry",
        "name code",
      )
      .sort({
        createdAt: -1,
      })
      .limit(5),

    Booking.findOne({
      userId,
    })
      .populate(
        "fromCountry",
        "name code",
      )
      .populate(
        "toCountry",
        "name code",
      )
      .sort({
        createdAt: -1,
      }),
  ]);

  return {
    overview: {
      totalBookings,

      pendingBookings,

      processingBookings,

      shippedBookings,

      completedBookings,

      cancelledBookings,
    },

    latestBooking,

    recentBookings,
  };
};

export const UserDashboardService = {
  getDashboardData,
};