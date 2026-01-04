import { API_BASE_URL, API_ENDPOINTS } from "@/lib/api.cofig";
import type {
    ApiError,
    IntrospectApiResponse,
    IntrospectPayload,
    LoginApiResponse,
    LoginPayload,
    LogoutApiResponse,
    LogoutPayload,
    RegisterApiResponse,
    RegisterPayload,
    UserApiResponse,
    VerifyEmailApiResponse,
    VerifyEmailPayload,
} from "../types";

// ============================================
// Token Storage
// ============================================

const TOKEN_KEY = "auth_token";

export const tokenStorage = {
  getToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem(TOKEN_KEY);
  },

  setToken: (token: string): void => {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(TOKEN_KEY, token);
  },

  clearToken: (): void => {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem(TOKEN_KEY);
  },
};

// ============================================
// HTTP Client Helper
// ============================================

// Success codes from your backend (adjust if needed)
const SUCCESS_CODES = [0, 1000];

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  // Check HTTP error
  if (!response.ok) {
    const error: ApiError = {
      code: data.code ?? response.status,
      message: data.message ?? "An unexpected error occurred",
      result: data.result,
    };
    throw error;
  }

  // Check business logic error (e.g., code: 1002 = "User existed")
  if (data.code !== undefined && !SUCCESS_CODES.includes(data.code)) {
    const error: ApiError = {
      code: data.code,
      message: data.message ?? "An error occurred",
      result: data.result,
    };
    throw error;
  }

  return data;
}

function getAuthHeaders(): HeadersInit {
  const token = tokenStorage.getToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// ============================================
// Auth API Functions
// ============================================

export async function login(payload: LoginPayload): Promise<LoginApiResponse> {
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await handleResponse<LoginApiResponse>(response);

  // Store token if login successful
  if (data.result?.token) {
    tokenStorage.setToken(data.result.token);
  }

  return data;
}

export async function register(
  payload: RegisterPayload
): Promise<RegisterApiResponse> {
  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.AUTH.REGISTER}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  return handleResponse<RegisterApiResponse>(response);
}

export async function logout(payload: LogoutPayload): Promise<LogoutApiResponse> {
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGOUT}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  // Clear token regardless of response
  tokenStorage.clearToken();

  return handleResponse<LogoutApiResponse>(response);
}

export async function introspect(
  payload: IntrospectPayload
): Promise<IntrospectApiResponse> {
  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.AUTH.INTROSPECT}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  return handleResponse<IntrospectApiResponse>(response);
}

export async function getUserById(id: string): Promise<UserApiResponse> {
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USERS.GET_BY_ID}/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse<UserApiResponse>(response);
}

export async function verifyEmail(
  payload: VerifyEmailPayload
): Promise<VerifyEmailApiResponse> {
  // API uses query parameters, not body
  const params = new URLSearchParams({
    email: payload.email,
    token: payload.token,
  });

  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.AUTH.VERIFY_EMAIL}?${params}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return handleResponse<VerifyEmailApiResponse>(response);
}

// ============================================
// JWT Helper Functions
// ============================================

interface JwtPayload {
  sub: string; // User ID or email
  exp?: number;
  iat?: number;
  // Common claims that might be in the token
  userId?: string;
  id?: string;
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  given_name?: string;
  family_name?: string;
  role?: string;
  scope?: string;
  [key: string]: unknown;
}

/**
 * Decode JWT token payload without verification.
 * Note: This doesn't verify the signature, just extracts the payload.
 */
export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = parts[1];
    // Handle URL-safe base64
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * Get user ID from JWT payload, checking multiple possible claim names.
 */
function getUserIdFromPayload(payload: JwtPayload): string | null {
  // Check various possible claim names for user ID
  // Order: explicit userId/id claims first, then sub if it looks like an ID
  if (payload.userId) return payload.userId;
  if (payload.id) return payload.id;
  
  // Check if sub is a UUID (typical user ID format) vs email
  const sub = payload.sub;
  if (sub && !sub.includes("@")) {
    // sub doesn't look like an email, assume it's a user ID
    return sub;
  }
  
  return null;
}

/**
 * Extract user info directly from JWT claims (for OAuth flows).
 */
export function getUserInfoFromToken(): { 
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  userId?: string;
} | null {
  const token = tokenStorage.getToken();
  if (!token) return null;

  const payload = decodeJwtPayload(token);
  if (!payload) return null;

  // Debug: log the full payload to see what's available
  console.log("JWT Payload:", payload);

  return {
    email: payload.email || (payload.sub?.includes("@") ? payload.sub : undefined),
    username: payload.username,
    firstName: payload.firstName || payload.given_name,
    lastName: payload.lastName || payload.family_name,
    role: payload.role,
    userId: getUserIdFromPayload(payload) || undefined,
  };
}

/**
 * Fetch user by username.
 */
export async function getUserByUsername(username: string): Promise<UserApiResponse> {
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USERS.GET_BY_USERNAME}/${username}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse<UserApiResponse>(response);
}

/**
 * Fetch the current user's info based on the stored token.
 * Decodes the JWT to get the username from sub claim, then fetches user details.
 */
export async function getMyInfo(): Promise<UserApiResponse> {
  const token = tokenStorage.getToken();
  if (!token) {
    throw { code: 401, message: "No token found" } as ApiError;
  }

  const payload = decodeJwtPayload(token);
  if (!payload?.sub) {
    throw { code: 401, message: "Invalid token format" } as ApiError;
  }

  // The sub claim contains the username
  return getUserByUsername(payload.sub);
}


