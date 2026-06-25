import { Router } from "express";

import { UserController } from "./user.controller";
import { UserValidation } from "./user.validation";

import { validateRequest } from "../../middlewares/validateRequest";

const router = Router();

router.get("/", UserController.getAllUsers);

router.patch(
  "/email-verification",
  validateRequest(
    UserValidation.updateEmailVerificationValidationSchema,
  ),
  UserController.updateEmailVerification,
);

router.patch(
  "/:id/role",
  validateRequest(UserValidation.updateUserRoleValidationSchema),
  UserController.updateUserRole,
);

router.patch(
  "/:id/ban",
  validateRequest(UserValidation.updateUserBanStatusValidationSchema),
  UserController.updateUserBanStatus,
);

export default router;
