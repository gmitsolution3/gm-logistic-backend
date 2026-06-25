import { Router } from "express";

import { OtpController } from "./otp.controller";
import { OtpValidation } from "./otp.validation";

import { validateRequest } from "../../middlewares/validateRequest";

const router = Router();

router.post(
  "/send",
  validateRequest(
    OtpValidation.sendOtpValidationSchema,
  ),
  OtpController.sendOtp,
);

router.post(
  "/verify",
  validateRequest(
    OtpValidation.verifyOtpValidationSchema,
  ),
  OtpController.verifyOtp,
);

export default router;