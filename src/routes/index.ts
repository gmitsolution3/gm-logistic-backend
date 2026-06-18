import { Router } from "express";
import defaultController from "../modules/default/default.controller";

const router = Router();

router.get("/", defaultController);

export default router;
