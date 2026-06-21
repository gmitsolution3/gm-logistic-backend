import { Router } from "express";
import categoryRoutes from "../modules/category/category.route";
import countryRoutes from "../modules/country/country.route";
import defaultController from "../modules/default/default.controller";
import pricingRoutes from "../modules/pricing/pricing.route";
import userRoutes from "../modules/user/user.route";

const router = Router();

router.get("/", defaultController);
router.use("/countries", countryRoutes);
router.use("/categories", categoryRoutes);
router.use("/pricing", pricingRoutes);
router.use("/users", userRoutes)

export default router;
