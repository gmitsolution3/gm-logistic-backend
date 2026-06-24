import { Router } from "express";

import { BookingController } from "./booking.controller";
import { BookingValidation } from "./booking.validation";

import { validateRequest } from "../../middlewares/validateRequest";

const router = Router();

router.post(
  "/",
  validateRequest(BookingValidation.createBookingValidationSchema),
  BookingController.createBooking,
);

router.get("/", BookingController.getAllBookings);

router.get("/user/:userId", BookingController.getBookingsByUserId);

router.get("/:id", BookingController.getSingleBooking);

router.patch(
  "/:id/status",
  validateRequest(
    BookingValidation.updateBookingStatusValidationSchema,
  ),
  BookingController.updateBookingStatus,
);

export default router;
