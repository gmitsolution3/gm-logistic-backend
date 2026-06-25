export const OTP_PURPOSE = {
  EMAIL_VERIFICATION:
    "email-verification",

  FORGOT_PASSWORD:
    "forgot-password",
} as const;

export const OTP_MESSAGES = {
  SENT: "OTP sent successfully",

  VERIFIED:
    "OTP verified successfully",

  INVALID: "Invalid OTP",

  EXPIRED: "OTP has expired",

  ALREADY_USED:
    "OTP has already been used",

  USER_NOT_FOUND:
    "User not found",
};