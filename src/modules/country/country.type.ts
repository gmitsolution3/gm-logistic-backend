export type TCountryFilters = {
  isActive?: boolean;
};

export type TCreateCountryPayload = {
  name: string;
  code: string;
  currency: string;
};

export type TUpdateCountryPayload = Partial<{
  name: string;
  code: string;
  currency: string;
  isActive: boolean;
}>;