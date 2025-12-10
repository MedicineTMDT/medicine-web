// Using empty string because Next.js rewrites proxy /api/* to backend
// This avoids CORS issues in development
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/api/v1/auth/register",
    LOGIN: "/api/v1/auth/login",
    LOGOUT: "/api/v1/auth/logout",
    INTROSPECT: "/api/v1/auth/introspect",
    VERIFY_EMAIL: "/api/v1/auth/verify-email",
    VERIFY_FORGOT_PASSWORD: "/api/v1/auth/verify-forgot-password",
  },
  USERS: {
    GET_BY_ID: "/api/v1/users",
    EDIT: "/api/v1/users/edit",
    CHANGE_PASSWORD: "/api/v1/users/change-password",
    UPDATE_AVATAR: "/api/v1/users/update-avatar-img",
    FORGOT_PASSWORD: "/api/v1/users/forgot-password",
  },
} as const;
