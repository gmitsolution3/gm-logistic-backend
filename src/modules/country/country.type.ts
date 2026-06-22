export type TCountryFilters = {
  isActive?: boolean;
};

export type TCreateCountryPayload = {
  name: string;
  code: string;
  currency: string;
  warehouse: string;
};

export type TUpdateCountryPayload = Partial<{
  name: string;
  code: string;
  currency: string;
  warehouse: string;
  isActive: boolean;
}>;