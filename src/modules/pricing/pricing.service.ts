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

import XLSX from "xlsx";

const getAllPricing = async (
  filters: TPricingFilters,
  paginationOptions: TPaginationOptions,
) => {
  const query: Record<string, unknown> = {};

  if (filters.countryId) {
    query.countryId = filters.countryId;
  }

  if (filters.categoryId) {
    query.categoryId = filters.categoryId;
  }

  if (filters.isConfigured !== undefined) {
    query.isConfigured = filters.isConfigured;
  }

  if (filters.searchTerm) {
    const searchTerm = filters.searchTerm?.trim();

    const countries = await Country.find({
      name: {
        $regex: searchTerm,
        $options: "i",
      },
    }).select("_id");

    const categories = await Category.find({
      label: {
        $regex: searchTerm,
        $options: "i",
      },
    }).select("_id");

    const countryIds = countries.map((country) => country._id);

    const categoryIds = categories.map((category) => category._id);

    query.$or = [
      {
        countryId: {
          $in: countryIds,
        },
      },
      {
        categoryId: {
          $in: categoryIds,
        },
      },
    ];
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

/*
 * Pricing export/import feature by excel sheet
 */

// Export pricing in excel sheet
const exportPricing = async (filters: TPricingFilters) => {
  const query: Record<string, unknown> = {};

  if (filters.countryId) {
    query.countryId = filters.countryId;
  }

  if (filters.categoryId) {
    query.categoryId = filters.categoryId;
  }

  if (filters.isConfigured !== undefined) {
    query.isConfigured = filters.isConfigured;
  }

  if (filters.searchTerm) {
    const countries = await Country.find({
      name: {
        $regex: filters.searchTerm,
        $options: "i",
      },
    }).select("_id");

    const categories = await Category.find({
      label: {
        $regex: filters.searchTerm,
        $options: "i",
      },
    }).select("_id");

    const countryIds = countries.map((country) => country._id);

    const categoryIds = categories.map((category) => category._id);

    query.$or = [
      {
        countryId: {
          $in: countryIds,
        },
      },
      {
        categoryId: {
          $in: categoryIds,
        },
      },
    ];
  }

  const pricing = await Pricing.find(query)
    .populate("countryId", "name code")
    .populate("categoryId", "label value")
    .sort({
      createdAt: -1,
    });

  const data = pricing.map((item) => ({
    pricingId: item._id.toString(),

    country: (item.countryId as any).name,

    category: (item.categoryId as any).label,

    minPrice: item.minPrice,

    maxPrice: item.maxPrice,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Pricing");

  const buffer = XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx",
  });

  return buffer;
};

// Import pricing excel sheet
const importPricing = async (fileBuffer: Buffer) => {
  const workbook = XLSX.read(fileBuffer, {
    type: "buffer",
  });

  const sheetName = workbook.SheetNames[0];

  const worksheet = workbook.Sheets[sheetName];

  const rows = XLSX.utils.sheet_to_json<{
    pricingId: string;
    minPrice: number;
    maxPrice: number;
  }>(worksheet);

  if (!rows.length) {
    throw new AppError(status.BAD_REQUEST, "Excel file is empty");
  }

  const errors: {
    row: number;
    pricingId: string;
    message: string;
  }[] = [];

  const operations = [];

  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];

    if (!row.pricingId) {
      errors.push({
        row: index + 2,
        pricingId: "",
        message: "Pricing ID is required",
      });

      continue;
    }

    const minPrice = Number(row.minPrice);

    const maxPrice = Number(row.maxPrice);

    if (Number.isNaN(minPrice)) {
      errors.push({
        row: index + 2,
        pricingId: row.pricingId,
        message: "Invalid minPrice",
      });

      continue;
    }

    if (Number.isNaN(maxPrice)) {
      errors.push({
        row: index + 2,
        pricingId: row.pricingId,
        message: "Invalid maxPrice",
      });

      continue;
    }

    if (maxPrice < minPrice) {
      errors.push({
        row: index + 2,
        pricingId: row.pricingId,
        message: PRICING_MESSAGES.INVALID_PRICE_RANGE,
      });

      continue;
    }

    operations.push({
      updateOne: {
        filter: {
          _id: row.pricingId,
        },

        update: {
          $set: {
            minPrice,
            maxPrice,

            isConfigured: minPrice > 0 || maxPrice > 0,
          },
        },
      },
    });
  }

  if (errors.length) {
    throw new AppError(status.BAD_REQUEST, JSON.stringify(errors));
  }

  if (!operations.length) {
    return {
      matchedRecords: 0,
      modifiedRecords: 0,
    };
  }

  const result = await Pricing.bulkWrite(operations);

  return {
    totalRows: rows.length,
    matchedRecords: result.matchedCount,
    modifiedRecords: result.modifiedCount,
  };
};

export const PricingService = {
  getAllPricing,
  getSinglePricing,
  updatePricing,

  createPricingForCountry,
  createPricingForCategory,

  generateMissingPricingRecords,

  exportPricing,
  importPricing,
};
