export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/api/v1/auth/register",
    LOGIN: "/api/v1/auth/login",
    ME: "/api/v1/auth/me",
    LOGOUT: "/api/v1/auth/logout",
  },
} as const;
