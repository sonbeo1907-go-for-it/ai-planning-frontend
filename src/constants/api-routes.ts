export const API_ROUTES = {
  AUTH: {
    LOGIN: "/auth/login",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
    PASSWORD_RESET_REQUEST: "/auth/password-reset-request",
    PASSWORD_RESET: "/auth/password-reset",
  },
  PROFILE: "/profile",
  PROFILE_PASSWORD: "/profile/password",
  WEEKLY_PLANS: "/weekly-plans",
  DAILY_PLANS: "/daily-plans",
  CURRICULUM: "/curriculum",
  ENROLLMENTS: "/enrollments",
  PLAN_REVIEWS: "/plan-reviews",
  USERS: "/users",
} as const;
