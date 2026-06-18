import status from "http-status";
import mongoose from "mongoose";
import { AppError } from "./AppError";

export const validateObjectId = (
  id: string,
  resource = "Resource",
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(status.BAD_REQUEST, `Invalid ${resource} id`);
  }
};
