import { Request, Response } from "express";
import status from "http-status";

import { PricingService } from "./pricing.service";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

import { PRICING_MESSAGES } from "./pricing.constant";

const getAllPricing = catchAsync(
  async (req: Request, res: Response) => {
    const filters = {
      countryId: req.query.countryId as string,
      categoryId: req.query.categoryId as string,

      isConfigured:
        req.query.isConfigured === undefined
          ? undefined
          : req.query.isConfigured === "true",

      searchTerm: req.query.searchTerm as string,
    };

    const paginationOptions = {
      page: req.query.page as string,
      limit: req.query.limit as string,
    };

    const result = await PricingService.getAllPricing(
      filters,
      paginationOptions,
    );

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: PRICING_MESSAGES.RETRIEVED,
      meta: result.meta,
      data: result.result,
    });
  },
);

const getSinglePricing = catchAsync(
  async (req: Request, res: Response) => {
    const result = await PricingService.getSinglePricing(
      req.params.id as string,
    );

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: PRICING_MESSAGES.SINGLE_RETRIEVED,
      data: result,
    });
  },
);

const updatePricing = catchAsync(
  async (req: Request, res: Response) => {
    const result = await PricingService.updatePricing(
      req.params.id as string,
      req.body,
    );

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: PRICING_MESSAGES.UPDATED,
      data: result,
    });
  },
);

const syncPricing = catchAsync(
  async (_req: Request, res: Response) => {
    const result =
      await PricingService.generateMissingPricingRecords();

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: PRICING_MESSAGES.SYNCED,
      data: result,
    });
  },
);

export const PricingController = {
  getAllPricing,
  getSinglePricing,
  updatePricing,
  syncPricing,
};
