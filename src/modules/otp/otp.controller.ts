import { Request, Response } from "express";
import status from "http-status";

import { OtpService } from "./otp.service";
import { OTP_MESSAGES } from "./otp.constant";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const sendOtp = catchAsync(
  async (
    req: Request,
    res: Response,
  ) => {
    await OtpService.sendOtp(
      req.body,
    );

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: OTP_MESSAGES.SENT,
    });
  },
);

const verifyOtp = catchAsync(
  async (
    req: Request,
    res: Response,
  ) => {
    await OtpService.verifyOtp(
      req.body,
    );

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message:
        OTP_MESSAGES.VERIFIED,
    });
  },
);

export const OtpController = {
  sendOtp,
  verifyOtp,
};