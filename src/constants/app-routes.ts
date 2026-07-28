export const APP_ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  FORBIDDEN: "/forbidden",
  STUDENT: {
    DASHBOARD: "/student/dashboard",
    WEEKLY_PLANS: "/student/weekly-plans",
    DAILY_PLANS: "/student/daily-plans",
  },
  INSTRUCTOR: {
    DASHBOARD: "/instructor/dashboard",
    PLAN_REVIEWS: "/instructor/plan-reviews",
  },
  ADMIN: {
    USERS: "/admin/users",
    CLASSES: "/admin/classes",
    COURSES: "/admin/courses",
  },
} as const;
