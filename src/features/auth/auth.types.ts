export const USER_ROLES = [
  "STUDENT",
  "INSTRUCTOR",
  "ADMIN",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const ACCOUNT_STATUSES = [
  "ACTIVE",
  "INACTIVE",
  "LOCKED",
] as const;

export type AccountStatus = (typeof ACCOUNT_STATUSES)[number];

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AccessTokenResponse {
  accessToken: string;
  tokenType: "Bearer";
  expiresIn: number;
}

export interface EnrollmentSummary {
  enrollmentId: string;
  classId: string;
  classCode: string;
  className: string;
  courseId: string;
  courseCode: string;
  courseName: string;
}

export interface AssignedClassSummary {
  classId: string;
  classCode: string;
  className: string;
  courseId: string;
  courseCode: string;
  courseName: string;
}

export interface CurrentUserProfile {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  status: AccountStatus;
  student?: {
    currentEnrollments: EnrollmentSummary[];
  };
  instructor?: {
    assignedClasses: AssignedClassSummary[];
  };
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordResetConfirmRequest {
  token: string;
  newPassword: string;
}
