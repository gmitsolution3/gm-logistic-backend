export type TCategoryFilters = {
  isActive?: boolean;
};

export type TCreateCategoryPayload = {
  label: string;
};

export type TUpdateCategoryPayload = Partial<{
  label: string;
  isActive: boolean;
}>;