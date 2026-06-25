import status from "http-status";

import { User } from "./user.model";

import {
  TUpdateEmailVerificationPayload,
  TUpdateUserBanStatusPayload,
  TUpdateUserRolePayload,
  TUserFilters,
} from "./user.types";

import { TPaginationOptions } from "../../types/common";

import { AppError } from "../../utils/AppError";
import { calculatePagination } from "../../utils/calculatePagination";
import { validateObjectId } from "../../utils/validateObjectId";

import { USER_MESSAGES } from "./user.constant";

const getAllUsers = async (
  filters: TUserFilters,
  paginationOptions: TPaginationOptions,
) => {
  const query: Record<string, unknown> = {};

  if (filters.role) {
    query.role = filters.role;
  }

  if (filters.isBanned !== undefined) {
    query.isBanned = filters.isBanned;
  }

  const searchTerm = filters.searchTerm?.trim();

  if (searchTerm) {
    query.$or = [
      {
        name: {
          $regex: searchTerm,
          $options: "i",
        },
      },
      {
        email: {
          $regex: searchTerm,
          $options: "i",
        },
      },
      {
        phone: {
          $regex: searchTerm,
          $options: "i",
        },
      },
    ];
  }

  const { page, limit, skip } =
    calculatePagination(paginationOptions);

  const total = await User.countDocuments(query);

  const users = await User.find(query)
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
    result: users,
  };
};

const updateUserRole = async (
  id: string,
  payload: TUpdateUserRolePayload,
) => {
  validateObjectId(id, "User");

  const user = await User.findById(id);

  if (!user) {
    throw new AppError(status.NOT_FOUND, USER_MESSAGES.NOT_FOUND);
  }

  user.role = payload.role;

  await user.save();

  return user;
};

const updateUserBanStatus = async (
  id: string,
  payload: TUpdateUserBanStatusPayload,
) => {
  validateObjectId(id, "User");

  const user = await User.findById(id);

  if (!user) {
    throw new AppError(status.NOT_FOUND, USER_MESSAGES.NOT_FOUND);
  }

  user.isBanned = payload.isBanned;

  await user.save();

  return user;
};

const updateEmailVerification = async (
  payload: TUpdateEmailVerificationPayload,
) => {
  const user = await User.findOne({
    email: payload.email,
  });

  if (!user) {
    throw new AppError(status.NOT_FOUND, USER_MESSAGES.NOT_FOUND);
  }

  user.emailVerified = payload.emailVerified;

  await user.save();

  return user;
};

export const UserService = {
  getAllUsers,
  updateUserRole,
  updateUserBanStatus,
  updateEmailVerification,
};
