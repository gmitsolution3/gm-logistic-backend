import { Router } from "express";
import defaultController from "../modules/default/default.controller";
import countryRoute from "../modules/country/country.route";

const router = Router();

router.get("/", defaultController);
router.use("/countries", countryRoute)

export default router;
