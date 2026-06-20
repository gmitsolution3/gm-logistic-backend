export type TPricingFilters = {
  countryId?: string;
  categoryId?: string;
  isConfigured?: boolean;
};

export type TUpdatePricingPayload = {
  minPrice: number;
  maxPrice: number;
};