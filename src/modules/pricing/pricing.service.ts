import status from "http-status";

import { Pricing } from "./pricing.model";
import {
  TPricingFilters,
  TUpdatePricingPayload,
} from "./pricing.types";

import { Category } from "../category/category.model";
import { Country } from "../country/country.model";

import { TPaginationOptions } from "../../types/common";

import { AppError } from "../../utils/AppError";
import { calculatePagination } from "../../utils/calculatePagination";
import { validateObjectId } from "../../utils/validateObjectId";

import { PRICING_MESSAGES } from "./pricing.constant";

const getAllPricing = async (
  filters: TPricingFilters,
  paginationOptions: TPaginationOptions,
) => {
  const query: {
    countryId?: string;
    categoryId?: string;
    isConfigured?: boolean;
  } = {};

  if (filters.countryId) {
    query.countryId = filters.countryId;
  }

  if (filters.categoryId) {
    query.categoryId = filters.categoryId;
  }

  if (filters.isConfigured !== undefined) {
    query.isConfigured = filters.isConfigured;
  }

  const { page, limit, skip } =
    calculatePagination(paginationOptions);

  const total = await Pricing.countDocuments(query);

  const pricing = await Pricing.find(query)
    .populate("countryId", "name code currency isActive")
    .populate("categoryId", "label value isActive")
    .sort({
      createdAt: -1,
    })
    .skip(skip)
    .limit(limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    result: pricing,
  };
};

const getSinglePricing = async (id: string) => {
  validateObjectId(id, "Pricing");

  const pricing = await Pricing.findById(id)
    .populate("countryId", "name code currency isActive")
    .populate("categoryId", "label value isActive");

  if (!pricing) {
    throw new AppError(status.NOT_FOUND, PRICING_MESSAGES.NOT_FOUND);
  }

  return pricing;
};

const updatePricing = async (
  id: string,
  payload: TUpdatePricingPayload,
) => {
  validateObjectId(id, "Pricing");

  if (payload.maxPrice < payload.minPrice) {
    throw new AppError(
      status.BAD_REQUEST,
      PRICING_MESSAGES.INVALID_PRICE_RANGE,
    );
  }

  const pricing = await Pricing.findById(id);

  if (!pricing) {
    throw new AppError(status.NOT_FOUND, PRICING_MESSAGES.NOT_FOUND);
  }

  pricing.minPrice = payload.minPrice;
  pricing.maxPrice = payload.maxPrice;

  pricing.isConfigured = true;

  await pricing.save();

  return await Pricing.findById(id)
    .populate("countryId", "name code currency isActive")
    .populate("categoryId", "label value isActive");
};

/**
 * Called when a new country is created
 */
const createPricingForCountry = async (countryId: string) => {
  const categories = await Category.find().select("_id");

  if (!categories.length) {
    return;
  }

  const pricingRecords = categories.map((category) => ({
    countryId,
    categoryId: category._id,
    minPrice: 0,
    maxPrice: 0,
    isConfigured: false,
  }));

  await Pricing.insertMany(pricingRecords, {
    ordered: false,
  });
};

/**
 * Called when a new category is created
 */
const createPricingForCategory = async (categoryId: string) => {
  const countries = await Country.find().select("_id");

  if (!countries.length) {
    return;
  }

  const pricingRecords = countries.map((country) => ({
    countryId: country._id,
    categoryId,
    minPrice: 0,
    maxPrice: 0,
    isConfigured: false,
  }));

  await Pricing.insertMany(pricingRecords, {
    ordered: false,
  });
};

/**
 * One-time sync utility
 * Creates missing pricing records
 */
const generateMissingPricingRecords = async () => {
  const countries = await Country.find().select("_id");

  const categories = await Category.find().select("_id");

  const operations = [];

  for (const country of countries) {
    for (const category of categories) {
      operations.push({
        updateOne: {
          filter: {
            countryId: country._id,
            categoryId: category._id,
          },
          update: {
            $setOnInsert: {
              countryId: country._id,
              categoryId: category._id,
              minPrice: 0,
              maxPrice: 0,
              isConfigured: false,
            },
          },
          upsert: true,
        },
      });
    }
  }

  if (!operations.length) {
    return {
      totalCountries: countries.length,
      totalCategories: categories.length,
      createdRecords: 0,
    };
  }

  const result = await Pricing.bulkWrite(operations, {
    ordered: false,
  });

  return {
    totalCountries: countries.length,
    totalCategories: categories.length,
    createdRecords: result.upsertedCount,
  };
};

export const PricingService = {
  getAllPricing,
  getSinglePricing,
  updatePricing,

  createPricingForCountry,
  createPricingForCategory,

  generateMissingPricingRecords,
};
