import { Request, Response } from "express";
import status from "http-status";

import { UserService } from "./user.service";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

import { USER_MESSAGES } from "./user.constant";

const getAllUsers = catchAsync(
  async (req: Request, res: Response) => {
    const filters = {
      searchTerm: req.query.searchTerm as string,

      role: req.query.role as string,

      isBanned:
        req.query.isBanned === undefined
          ? undefined
          : req.query.isBanned === "true",
    };

    const paginationOptions = {
      page: req.query.page as string,
      limit: req.query.limit as string,
    };

    const result = await UserService.getAllUsers(
      filters,
      paginationOptions,
    );

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: USER_MESSAGES.RETRIEVED,
      meta: result.meta,
      data: result.result,
    });
  },
);

const updateUserRole = catchAsync(
  async (req: Request, res: Response) => {
    const result = await UserService.updateUserRole(
      req.params.id as string,
      req.body,
    );

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: USER_MESSAGES.ROLE_UPDATED,
      data: result,
    });
  },
);

const updateUserBanStatus = catchAsync(
  async (req: Request, res: Response) => {
    const result = await UserService.updateUserBanStatus(
      req.params.id as string,
      req.body,
    );

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: USER_MESSAGES.BAN_STATUS_UPDATED,
      data: result,
    });
  },
);

const updateEmailVerification = catchAsync(
  async (req: Request, res: Response) => {
    const result = await UserService.updateEmailVerification(
      req.body,
    );

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: USER_MESSAGES.EMAIL_VERIFICATION_UPDATED,
      data: result,
    });
  },
);

export const UserController = {
  getAllUsers,
  updateUserRole,
  updateUserBanStatus,
  updateEmailVerification,
};
