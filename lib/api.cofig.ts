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
    GET_BY_USERNAME: "/api/v1/users/username",
    MY_INFO: "/api/v1/users/my-info",
    EDIT: "/api/v1/users/edit",
    CHANGE_PASSWORD: "/api/v1/users/change-password",
    UPDATE_AVATAR: "/api/v1/users/update-avatar-img",
    FORGOT_PASSWORD: "/api/v1/users/forgot-password",
  },
  DRUGS: {
    GET_ALL: "/api/v1/drugs",
    GET_BY_ID: "/api/v1/drugs",
    SEARCH: "/api/v1/drugs/search",
    TOP10: "/api/v1/drugs/top10",
    INGREDIENTS: "/api/v1/drugs",
    BY_CATEGORY: "/api/v1/drugs/by-category",
  },
  CATEGORIES: {
    GET_ALL: "/api/v1/categories",
    GET_BY_ID: "/api/v1/categories",
    SEARCH: "/api/v1/categories/search",
  },
  CATEGORY_DETAIL: {
    GET_ALL: "/api/v1/category-detail",
    GET_BY_ID: "/api/v1/category-detail",
    SEARCH: "/api/v1/category-detail/search",
    BY_CATEGORY: "/api/v1/category-detail/by-category",
  },
  DRUG_INTERACTIONS: {
    GET_BY_ID: "/api/v1/drug-interactions",
    SEARCH_BY_INGREDIENTS: "/api/v1/drug-interactions/search-by-ingredients",
  },
  MERGED_INGREDIENT: {
    SUGGEST: "/api/v1/merged-ingredient/suggest",
  },
  REQUESTS: {
    CREATE: "/api/v1/requests",
    GET_BY_USER: "/api/v1/requests/user",
  },
  PRESCRIPTIONS: {
    BASE: "/api/v1/prescriptions",
    SCAN: "/api/v1/prescriptions/scan",
    CREATE: "/api/v1/prescriptions",
    GET_BY_ID: "/api/v1/prescriptions",
    COPY: "/api/v1/prescriptions",
    SEARCH_BY_NAME: "/api/v1/prescriptions/search/name",
    SEARCH_BY_DATE: "/api/v1/prescriptions/search/date",
    REVIEW: "/api/v1/prescriptions/review",
    EDIT_INTAKE: "/api/v1/prescriptions/edit",
    ACCEPT: "/api/v1/prescriptions", // /{id}/accept
    UPDATE_MESSAGE: "/api/v1/prescriptions", // /{id}/message
  },
  CHATBOT: {
    ANALYZE: "/chatbot/analyze",
  },
} as const;

