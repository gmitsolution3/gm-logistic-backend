export type TPricingFilters = {
  countryId?: string;
  categoryId?: string;
  isConfigured?: boolean;
  searchTerm?: string;
};

export type TUpdatePricingPayload = {
  minPrice: number;
  maxPrice: number;
};