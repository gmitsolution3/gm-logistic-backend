import { Router } from "express";
import adminDashboardRoute from "../modules/admin-dashboard/admin-dashboard.route";
import categoryRoutes from "../modules/category/category.route";
import countryRoutes from "../modules/country/country.route";
import defaultController from "../modules/default/default.controller";
import otpRoutes from "../modules/otp/otp.route";
import pricingRoutes from "../modules/pricing/pricing.route";
import userDashboardRoute from "../modules/user-dashboard/user-dashboard.route";
import userRoutes from "../modules/user/user.route";
import bookingRoutes from "./../modules/booking/booking.route";

const router = Router();

router.get("/", defaultController);
router.use("/countries", countryRoutes);
router.use("/categories", categoryRoutes);
router.use("/pricing", pricingRoutes);
router.use("/users", userRoutes);
router.use("/bookings", bookingRoutes);
router.use("/admin-dashboard", adminDashboardRoute);
router.use("/user-dashboard", userDashboardRoute);
router.use("/otp", otpRoutes);

export default router;
