import { API_BASE_URL, API_ENDPOINTS } from "@/lib/api.cofig";
import type {
  LoginPayload,
  LoginApiResponse,
  RegisterPayload,
  RegisterApiResponse,
  LogoutPayload,
  LogoutApiResponse,
  IntrospectPayload,
  IntrospectApiResponse,
  UserApiResponse,
  VerifyEmailPayload,
  VerifyEmailApiResponse,
  ApiError,
} from "../types";

// ============================================
// Token Storage
// ============================================

const TOKEN_KEY = "auth_token";

export const tokenStorage = {
  getToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken: (token: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_KEY, token);
  },

  clearToken: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
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

