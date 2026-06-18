import { Router } from "express";
import defaultController from "../modules/default/default.controller";
import countryRoutes from "../modules/country/country.route";
import categoryRoutes from "../modules/category/category.route";

const router = Router();

router.get("/", defaultController);
router.use("/countries", countryRoutes)
router.use(
  "/categories",
  categoryRoutes,
);

export default router;
