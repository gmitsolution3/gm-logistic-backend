export type TPaginationOptions = {
  page?: string;
  limit?: string;
};

export type TPaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};