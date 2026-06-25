import status from "http-status";

import { EmailService } from "../../services/email.service";
import { otpTemplate } from "../../services/templates/otp.template";
import { AppError } from "../../utils/AppError";
import { generateOtp } from "../../utils/generateOtp";
import { User } from "../user/user.model";
import { Otp } from "./otp.model";
import { TSendOtpPayload, TVerifyOtpPayload } from "./otp.types";

const sendOtp = async (payload: TSendOtpPayload) => {
  const user = await User.findOne({
    email: payload.email,
  });

  if (!user) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  const otp = generateOtp();

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await Otp.findOneAndUpdate(
    {
      email: payload.email,

      purpose: payload.purpose,
    },

    {
      otp,

      expiresAt,

      isUsed: false,
    },

    {
      upsert: true,

      new: true,
    },
  );

  await EmailService.sendEmail({
    to: payload.email,

    subject: "Your GM Logistic Verification Code",

    html: otpTemplate(otp),
  });

  return null;
};

const verifyOtp = async (payload: TVerifyOtpPayload) => {
  const otp = await Otp.findOne({
    email: payload.email,

    purpose: payload.purpose,
  });

  if (!otp) {
    throw new AppError(status.NOT_FOUND, "OTP not found");
  }

  if (otp.isUsed) {
    throw new AppError(status.BAD_REQUEST, "OTP already used");
  }

  if (otp.expiresAt < new Date()) {
    throw new AppError(status.BAD_REQUEST, "OTP expired");
  }

  if (otp.otp !== payload.otp) {
    throw new AppError(status.BAD_REQUEST, "Invalid OTP");
  }

  otp.isUsed = true;

  await otp.save();

  return null;
};

export const OtpService = {
  sendOtp,
  verifyOtp,
};
