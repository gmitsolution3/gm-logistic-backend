import status from "http-status";

import { Request, Response } from "express";

import { CountryService } from "./country.service";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

import { COUNTRY_MESSAGES } from "./country.constant";

const createCountry = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CountryService.createCountry(req.body);

    sendResponse(res, {
      statusCode: status.CREATED,
      success: true,
      message: COUNTRY_MESSAGES.CREATED,
      data: result,
    });
  },
);

const getAllCountries = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CountryService.getAllCountries({
      isActive:
        req.query.isActive === undefined
          ? undefined
          : req.query.isActive === "true",
    });

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: COUNTRY_MESSAGES.RETRIEVED,
      data: result,
    });
  },
);

const getSingleCountry = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CountryService.getSingleCountry(
      req.params.id as string,
    );

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: COUNTRY_MESSAGES.SINGLE_RETRIEVED,
      data: result,
    });
  },
);

const updateCountry = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CountryService.updateCountry(
      req.params.id as string,
      req.body,
    );

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: COUNTRY_MESSAGES.UPDATED,
      data: result,
    });
  },
);

const updateCountryStatus = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CountryService.updateCountryStatus(
      req.params.id as string,
      req.body.isActive,
    );

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: COUNTRY_MESSAGES.STATUS_UPDATED,
      data: result,
    });
  },
);

export const CountryController = {
  createCountry,
  getAllCountries,
  getSingleCountry,
  updateCountry,
  updateCountryStatus,
};
