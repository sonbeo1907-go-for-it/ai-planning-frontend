export const API_ROUTES = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    GOOGLE_LOGIN: "/auth/google",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
  },
  PROFILE: "/profile",
  WEEKLY_PLANS: "/weekly-plans",
  DAILY_PLANS: "/daily-plans",
  CURRICULUM: "/curriculum",
  ENROLLMENTS: "/enrollments",
  PLAN_REVIEWS: "/plan-reviews",
  USERS: "/users",
} as const;
