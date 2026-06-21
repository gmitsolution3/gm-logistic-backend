import { Router } from "express";

import { PricingController } from "./pricing.controller";
import { PricingValidation } from "./pricing.validation";

import { validateRequest } from "../../middlewares/validateRequest";

const router = Router();

router.get("/", PricingController.getAllPricing);

router.post("/sync", PricingController.syncPricing);

router.get("/export", PricingController.exportPricing);

router.get("/:id", PricingController.getSinglePricing);

router.patch(
  "/:id",
  validateRequest(PricingValidation.updatePricingValidationSchema),
  PricingController.updatePricing,
);

export default router;
