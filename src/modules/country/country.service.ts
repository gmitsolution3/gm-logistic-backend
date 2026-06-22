import status from "http-status";

import { Country } from "./country.model";

import { TPaginationOptions } from "../../types/pagination";
import { AppError } from "../../utils/AppError";
import { calculatePagination } from "../../utils/calculatePagination";
import { validateObjectId } from "../../utils/validateObjectId";
import { COUNTRY_MESSAGES } from "./country.constant";
import { TCountryFilters, TCreateCountryPayload } from "./country.type";
import { PricingService } from "../pricing/pricing.service";

const createCountry = async (payload: TCreateCountryPayload) => {
  const existingName = await Country.findOne({
    name: payload.name,
  });

  if (existingName) {
    throw new AppError(status.CONFLICT, COUNTRY_MESSAGES.NAME_EXISTS);
  }

  const existingCode = await Country.findOne({
    code: payload.code.toUpperCase(),
  });

  if (existingCode) {
    throw new AppError(status.CONFLICT, COUNTRY_MESSAGES.CODE_EXISTS);
  }

  const country = await Country.create({
    ...payload,
    code: payload.code.toUpperCase(),
    currency: payload.currency.toUpperCase(),
  });

  await PricingService.createPricingForCountry(
  country._id.toString(),
);

return country;
};

const getAllCountries = async (
  filters: TCountryFilters,
  paginationOptions: TPaginationOptions,
) => {
  const query: TCountryFilters = {};

  if (filters.isActive !== undefined) {
    query.isActive = filters.isActive;
  }

  const { page, limit, skip } =
    calculatePagination(paginationOptions);

  const total = await Country.countDocuments(query);

  const countries = await Country.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    result: countries,
  };
};

const getSingleCountry = async (id: string) => {
  validateObjectId(id, "Country");

  const country = await Country.findById(id);

  if (!country) {
    throw new AppError(status.NOT_FOUND, COUNTRY_MESSAGES.NOT_FOUND);
  }

  return country;
};

const updateCountry = async (
  id: string,
  payload: Partial<{
    name: string;
    code: string;
    currency: string;
    isActive: boolean;
  }>,
) => {
  validateObjectId(id, "Country");

  const country = await Country.findById(id);

  if (!country) {
    throw new AppError(status.NOT_FOUND, COUNTRY_MESSAGES.NOT_FOUND);
  }

  if (payload.name) {
    const existingName = await Country.findOne({
      name: payload.name,
      _id: { $ne: id },
    });

    if (existingName) {
      throw new AppError(
        status.CONFLICT,
        COUNTRY_MESSAGES.NAME_EXISTS,
      );
    }
  }

  if (payload.code) {
    const normalizedCode = payload.code.toUpperCase();

    const existingCode = await Country.findOne({
      code: normalizedCode,
      _id: { $ne: id },
    });

    if (existingCode) {
      throw new AppError(
        status.CONFLICT,
        COUNTRY_MESSAGES.CODE_EXISTS,
      );
    }

    payload.code = normalizedCode;
  }

  if (payload.currency) {
    payload.currency = payload.currency.toUpperCase();
  }

  Object.assign(country, payload);

  await country.save();

  return country;
};

const updateCountryStatus = async (id: string, isActive: boolean) => {
  validateObjectId(id, "Country");

  const country = await Country.findById(id);

  if (!country) {
    throw new AppError(status.NOT_FOUND, COUNTRY_MESSAGES.NOT_FOUND);
  }

  country.isActive = isActive;

  await country.save();

  return country;
};

export const CountryService = {
  createCountry,
  getAllCountries,
  getSingleCountry,
  updateCountry,
  updateCountryStatus,
};
