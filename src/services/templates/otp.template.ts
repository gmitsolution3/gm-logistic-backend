export const otpTemplate = (otp: string) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto;">
      <h2>${process.env.APP_NAME}</h2>

      <p>Your verification code is:</p>

      <h1
        style="
          letter-spacing:8px;
          color:#2563eb;
        "
      >
        ${otp}
      </h1>

      <p>
        This OTP will expire in
        <strong>5 minutes</strong>.
      </p>

      <p>
        If you didn't request this,
        you can safely ignore this
        email.
      </p>
    </div>
  `;
};
