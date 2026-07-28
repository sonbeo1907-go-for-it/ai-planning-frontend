export const API_ROUTES = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  },
  WEEKLY_PLANS: "/weekly-plans",
  DAILY_PLANS: "/daily-plans",
  CURRICULUM: "/curriculum",
  ENROLLMENTS: "/enrollments",
  PLAN_REVIEWS: "/plan-reviews",
  USERS: "/users",
} as const;
