import { Router } from "express";

import { CountryController } from "./country.controller";
import { CountryValidation } from "./country.validation";

import { validateRequest } from "../../middlewares/validateRequest";

const router = Router();

router.post(
  "/",
  validateRequest(
    CountryValidation.createCountryValidationSchema,
  ),
  CountryController.createCountry,
);

router.get("/", CountryController.getAllCountries);

router.get("/:id", CountryController.getSingleCountry);

router.patch(
  "/:id",
  validateRequest(
    CountryValidation.updateCountryValidationSchema,
  ),
  CountryController.updateCountry,
);

router.patch(
  "/:id/status",
  validateRequest(
    CountryValidation.updateCountryStatusValidationSchema,
  ),
  CountryController.updateCountryStatus,
);

export default router;