import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { AppError } from "../utils/AppError";

export default function errorHandler(
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error(error.stack);

  let statusCode = error.statusCode || 500;
  let message = error.message || "Internal Server Error";

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    status: status[statusCode],
    message,
  });
}
