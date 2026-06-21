import { User } from "../user/user.model";
import { Country } from "../country/country.model";
import { Category } from "../category/category.model";
import { Pricing } from "../pricing/pricing.model";

const getDashboardStats = async () => {
  const [
    totalUsers,
    totalAdmins,
    totalBannedUsers,

    totalCountries,
    activeCountries,

    totalCategories,
    activeCategories,

    totalPricingRecords,
    configuredPricingRecords,
    pendingPricingRecords,

    recentUsers,
  ] = await Promise.all([
    User.countDocuments(),

    User.countDocuments({
      role: "admin",
    }),

    User.countDocuments({
      isBanned: true,
    }),

    Country.countDocuments(),

    Country.countDocuments({
      isActive: true,
    }),

    Category.countDocuments(),

    Category.countDocuments({
      isActive: true,
    }),

    Pricing.countDocuments(),

    Pricing.countDocuments({
      isConfigured: true,
    }),

    Pricing.countDocuments({
      isConfigured: false,
    }),

    User.find()
      .sort({
        createdAt: -1,
      })
      .limit(5)
      .select(
        "name email role image createdAt",
      ),
  ]);

  const pricingCompletionPercentage =
    totalPricingRecords === 0
      ? 0
      : Math.round(
          (configuredPricingRecords /
            totalPricingRecords) *
            100,
        );

  return {
    users: {
      totalUsers,
      totalAdmins,
      totalBannedUsers,
    },

    countries: {
      totalCountries,
      activeCountries,
    },

    categories: {
      totalCategories,
      activeCategories,
    },

    pricing: {
      totalPricingRecords,
      configuredPricingRecords,
      pendingPricingRecords,
      pricingCompletionPercentage,
    },

    recentUsers,
  };
};

export const AdminDashboardService = {
  getDashboardStats,
};