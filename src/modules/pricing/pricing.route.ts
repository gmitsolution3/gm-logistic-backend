import { Router } from "express";

import { PricingController } from "./pricing.controller";
import { PricingValidation } from "./pricing.validation";

import { validateRequest } from "../../middlewares/validateRequest";

import { uploadExcel } from "../../middlewares/uploadExcel";

const router = Router();

router.get("/", PricingController.getAllPricing);

router.post("/sync", PricingController.syncPricing);

router.get("/export", PricingController.exportPricing);

router.post(
  "/import",
  uploadExcel.single("file"),
  PricingController.importPricing,
);

router.get("/:id", PricingController.getSinglePricing);

router.patch(
  "/:id",
  validateRequest(PricingValidation.updatePricingValidationSchema),
  PricingController.updatePricing,
);

export default router;
