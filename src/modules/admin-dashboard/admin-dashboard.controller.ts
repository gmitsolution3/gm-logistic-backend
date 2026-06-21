import { Request, Response } from "express";
import status from "http-status";

import { AdminDashboardService } from "./admin-dashboard.service";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

import { ADMIN_DASHBOARD_MESSAGES } from "./admin-dashboard.constant";

const getDashboardStats = catchAsync(
  async (
    _req: Request,
    res: Response,
  ) => {
    const result =
      await AdminDashboardService.getDashboardStats();

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message:
        ADMIN_DASHBOARD_MESSAGES.STATS_RETRIEVED,
      data: result,
    });
  },
);

export const AdminDashboardController =
  {
    getDashboardStats,
  };