import { Router } from "express";

import { UserDashboardController } from "./user-dashboard.controller";

const router = Router();

router.get("/:userId", UserDashboardController.getDashboardData);

export default router;
