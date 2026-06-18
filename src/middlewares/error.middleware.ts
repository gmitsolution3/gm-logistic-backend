import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import mongoose from "mongoose";
import status from "http-status";
import { AppError } from "../utils/AppError";

export default function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  let statusCode = status.INTERNAL_SERVER_ERROR;
  let message = "Internal Server Error";
  let errorSources: { path: string | number; message: string }[] = [];

  console.error(error);

  // AppError
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  }

  // Zod Error
  else if (error instanceof ZodError) {
    statusCode = status.BAD_REQUEST;
    message = "Validation Error";

    errorSources = error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
  }

  // Mongoose Validation Error
  else if (error instanceof mongoose.Error.ValidationError) {
    statusCode = status.BAD_REQUEST;
    message = "Validation Error";

    errorSources = Object.values(error.errors).map((err) => ({
      path: err.path,
      message: err.message,
    }));
  }

  // Invalid ObjectId
  else if (error instanceof mongoose.Error.CastError) {
    statusCode = status.BAD_REQUEST;
    message = `Invalid ${error.path}`;
  }

  // Duplicate Key Error
  else if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  ) {
    statusCode = status.CONFLICT;

    const field = Object.keys(
      (error as { keyPattern?: Record<string, unknown> }).keyPattern || {},
    )[0];

    message = `${field} already exists`;
  }

  // Native Error
  else if (error instanceof Error) {
    message = error.message;
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    status: status[statusCode],
    message,
    errorSources,
  });
}