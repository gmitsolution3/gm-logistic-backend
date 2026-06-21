import { Router } from "express";

import { AdminDashboardController } from "./admin-dashboard.controller";

const router = Router();

router.get("/", AdminDashboardController.getDashboardStats);

export default router;
