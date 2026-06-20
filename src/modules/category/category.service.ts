import status from "http-status";

import { Category } from "./category.model";
import {
  TCategoryFilters,
  TCreateCategoryPayload,
  TUpdateCategoryPayload,
} from "./category.types";

import { TPaginationOptions } from "../../types/common";

import { AppError } from "../../utils/AppError";
import { calculatePagination } from "../../utils/calculatePagination";
import { generateSlug } from "../../utils/generateSlug";
import { validateObjectId } from "../../utils/validateObjectId";

import { PricingService } from "../pricing/pricing.service";
import { CATEGORY_MESSAGES } from "./category.constant";

const createCategory = async (payload: TCreateCategoryPayload) => {
  const value = generateSlug(payload.label);

  const existingCategory = await Category.findOne({ value });

  if (existingCategory) {
    throw new AppError(
      status.CONFLICT,
      CATEGORY_MESSAGES.VALUE_EXISTS,
    );
  }

  const category = await Category.create({
    label: payload.label.trim(),
    value,
  });

  await PricingService.createPricingForCategory(
    category._id.toString(),
  );

  return category;
};

const getAllCategories = async (
  filters: TCategoryFilters,
  paginationOptions: TPaginationOptions,
) => {
  const query: TCategoryFilters = {};

  if (filters.isActive !== undefined) {
    query.isActive = filters.isActive;
  }

  const { page, limit, skip } =
    calculatePagination(paginationOptions);

  const total = await Category.countDocuments(query);

  const categories = await Category.find(query)
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
    result: categories,
  };
};

const getSingleCategory = async (id: string) => {
  validateObjectId(id, "Category");

  const category = await Category.findById(id);

  if (!category) {
    throw new AppError(status.NOT_FOUND, CATEGORY_MESSAGES.NOT_FOUND);
  }

  return category;
};

const updateCategory = async (
  id: string,
  payload: TUpdateCategoryPayload,
) => {
  validateObjectId(id, "Category");

  const category = await Category.findById(id);

  if (!category) {
    throw new AppError(status.NOT_FOUND, CATEGORY_MESSAGES.NOT_FOUND);
  }

  if (payload.label) {
    const value = generateSlug(payload.label);

    const existingCategory = await Category.findOne({
      value,
      _id: { $ne: id },
    });

    if (existingCategory) {
      throw new AppError(
        status.CONFLICT,
        CATEGORY_MESSAGES.VALUE_EXISTS,
      );
    }

    category.label = payload.label.trim();
    category.value = value;
  }

  if (typeof payload.isActive !== "undefined") {
    category.isActive = payload.isActive;
  }

  await category.save();

  return category;
};

const updateCategoryStatus = async (
  id: string,
  isActive: boolean,
) => {
  validateObjectId(id, "Category");

  const category = await Category.findById(id);

  if (!category) {
    throw new AppError(status.NOT_FOUND, CATEGORY_MESSAGES.NOT_FOUND);
  }

  category.isActive = isActive;

  await category.save();

  return category;
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  updateCategoryStatus,
};
