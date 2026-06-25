import status from "http-status";

import { Otp } from "./otp.model";

import { User } from "../user/user.model";

import { AppError } from "../../utils/AppError";

import { generateOtp } from "../../utils/generateOtp";

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

  // TODO:
  // send email

  console.log("OTP:", otp);

  return null;
};

const verifyOtp = async (
  payload: TVerifyOtpPayload,
) => {
  const otp =
    await Otp.findOne({
      email: payload.email,

      purpose:
        payload.purpose,
    });

  if (!otp) {
    throw new AppError(
      status.NOT_FOUND,
      "OTP not found",
    );
  }

  if (otp.isUsed) {
    throw new AppError(
      status.BAD_REQUEST,
      "OTP already used",
    );
  }

  if (
    otp.expiresAt <
    new Date()
  ) {
    throw new AppError(
      status.BAD_REQUEST,
      "OTP expired",
    );
  }

  if (
    otp.otp !==
    payload.otp
  ) {
    throw new AppError(
      status.BAD_REQUEST,
      "Invalid OTP",
    );
  }

  otp.isUsed = true;

  await otp.save();

  return null;
};

export const OtpService = {
  sendOtp,
  verifyOtp,
};