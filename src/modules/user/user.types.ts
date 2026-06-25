export type TUserFilters = {
  searchTerm?: string;
  role?: string;
  isBanned?: boolean;
};

export type TUpdateUserRolePayload = {
  role: "admin" | "user";
};

export type TUpdateUserBanStatusPayload = {
  isBanned: boolean;
};

export type TUpdateEmailVerificationPayload = {
  email: string;
  emailVerified: boolean;
};
