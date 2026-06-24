import { Request, Response } from "express";
import status from "http-status";

import { BOOKING_MESSAGES } from "./booking.constant";
import { BookingService } from "./booking.service";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const createBooking = catchAsync(
  async (req: Request, res: Response) => {
    const result = await BookingService.createBooking(req.body);

    sendResponse(res, {
      statusCode: status.CREATED,
      success: true,
      message: BOOKING_MESSAGES.CREATED,
      data: result,
    });
  },
);

const getAllBookings = catchAsync(
  async (req: Request, res: Response) => {
    const filters = {
      searchTerm: req.query.searchTerm as string,

      status: req.query.status as string,

      userId: req.query.userId as string,
    };

    const paginationOptions = {
      page: req.query.page as string,

      limit: req.query.limit as string,
    };

    const result = await BookingService.getAllBookings(
      filters,
      paginationOptions,
    );

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: BOOKING_MESSAGES.RETRIEVED,
      meta: result.meta,
      data: result.result,
    });
  },
);

const getSingleBooking = catchAsync(
  async (req: Request, res: Response) => {
    const result = await BookingService.getSingleBooking(
      req.params.id as string,
    );

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: BOOKING_MESSAGES.SINGLE_RETRIEVED,
      data: result,
    });
  },
);

const getBookingsByUserId = catchAsync(
  async (req: Request, res: Response) => {
    const filters = {
      status: req.query.status as string,

      searchTerm: req.query.searchTerm as string,
    };

    const paginationOptions = {
      page: req.query.page as string,

      limit: req.query.limit as string,
    };

    const result = await BookingService.getBookingsByUserId(
      req.params.userId as string,
      filters,
      paginationOptions,
    );

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: BOOKING_MESSAGES.RETRIEVED,
      meta: result.meta,
      data: result.result,
    });
  },
);

const updateBookingStatus = catchAsync(
  async (req: Request, res: Response) => {
    const result = await BookingService.updateBookingStatus(
      req.params.id as string,
      req.body,
    );

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: BOOKING_MESSAGES.STATUS_UPDATED,
      data: result,
    });
  },
);

export const BookingController = {
  createBooking,
  getAllBookings,
  getSingleBooking,
  getBookingsByUserId,
  updateBookingStatus,
};
