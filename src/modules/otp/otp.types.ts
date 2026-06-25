import { OTP_PURPOSE } from "./otp.constant";

export type TOtpPurpose =
  (typeof OTP_PURPOSE)[keyof typeof OTP_PURPOSE];

export type TSendOtpPayload = {
  email: string;
  purpose: TOtpPurpose;
};

export type TVerifyOtpPayload = {
  email: string;
  otp: string;
  purpose: TOtpPurpose;
};