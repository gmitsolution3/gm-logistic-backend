import { Request, Response } from "express";
import status from "http-status";

import { CategoryService } from "./category.service";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

import { CATEGORY_MESSAGES } from "./category.constant";

const createCategory = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await CategoryService.createCategory(req.body);

    sendResponse(res, {
      statusCode: status.CREATED,
      success: true,
      message: CATEGORY_MESSAGES.CREATED,
      data: result,
    });
  },
);

const getAllCategories = catchAsync(
  async (req: Request, res: Response) => {
    const filters = {
      isActive:
        req.query.isActive === undefined
          ? undefined
          : req.query.isActive === "true",
    };

    const paginationOptions = {
      page: req.query.page as string,
      limit: req.query.limit as string,
    };

    const result =
      await CategoryService.getAllCategories(
        filters,
        paginationOptions,
      );

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: CATEGORY_MESSAGES.RETRIEVED,
      meta: result.meta,
      data: result.result,
    });
  },
);

const getSingleCategory = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await CategoryService.getSingleCategory(
        req.params.id as string,
      );

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message:
        CATEGORY_MESSAGES.SINGLE_RETRIEVED,
      data: result,
    });
  },
);

const updateCategory = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await CategoryService.updateCategory(
        req.params.id as string,
        req.body,
      );

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: CATEGORY_MESSAGES.UPDATED,
      data: result,
    });
  },
);

const updateCategoryStatus = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await CategoryService.updateCategoryStatus(
        req.params.id as string,
        req.body.isActive,
      );

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message:
        CATEGORY_MESSAGES.STATUS_UPDATED,
      data: result,
    });
  },
);

export const CategoryController = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  updateCategoryStatus,
};