import { Router } from "express";

import { CategoryController } from "./category.controller";
import { CategoryValidation } from "./category.validation";

import { validateRequest } from "../../middlewares/validateRequest";

const router = Router();

router.post(
  "/",
  validateRequest(
    CategoryValidation.createCategoryValidationSchema,
  ),
  CategoryController.createCategory,
);

router.get(
  "/",
  CategoryController.getAllCategories,
);

router.get(
  "/:id",
  CategoryController.getSingleCategory,
);

router.patch(
  "/:id",
  validateRequest(
    CategoryValidation.updateCategoryValidationSchema,
  ),
  CategoryController.updateCategory,
);

router.patch(
  "/:id/status",
  validateRequest(
    CategoryValidation.updateCategoryStatusValidationSchema,
  ),
  CategoryController.updateCategoryStatus,
);

export default router;