import { Request, Response } from "express";
import status from "http-status";

import { UserDashboardService } from "./user-dashboard.service";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

import { USER_DASHBOARD_MESSAGES } from "./user-dashboard.constant";

const getDashboardData = catchAsync(
  async (
    req: Request,
    res: Response,
  ) => {
    const result =
      await UserDashboardService.getDashboardData(
        req.params.userId as string,
      );

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message:
        USER_DASHBOARD_MESSAGES.RETRIEVED,
      data: result,
    });
  },
);

export const UserDashboardController =
  {
    getDashboardData,
  };