import { API_BASE_URL, API_ENDPOINTS } from "@/lib/api.cofig";
import { tokenStorage } from "@/lib/token-storage";
import { fetchWithAuth } from "@/lib/fetch-with-auth";
import type {
  EditUserPayload,
  EditUserApiResponse,
  ChangePasswordPayload,
  ChangePasswordApiResponse,
  UpdateAvatarPayload,
  UpdateAvatarApiResponse,
  ForgotPasswordPayload,
  ForgotPasswordApiResponse,
  GetUserApiResponse,
} from "../types";
import type { ApiError } from "@/features/auth/types";

// ============================================
// HTTP Client Helper
// ============================================

const SUCCESS_CODES = [0, 1000];

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    const error: ApiError = {
      code: data.code ?? response.status,
      message: data.message ?? "An unexpected error occurred",
      result: data.result,
    };
    throw error;
  }

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
// User API Functions
// ============================================

export async function getUser(id: string): Promise<GetUserApiResponse> {
  const response = await fetchWithAuth(
    `${API_BASE_URL}${API_ENDPOINTS.USERS.GET_BY_ID}/${id}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  return handleResponse<GetUserApiResponse>(response);
}

export async function editUser(
  payload: EditUserPayload
): Promise<EditUserApiResponse> {
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USERS.EDIT}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  return handleResponse<EditUserApiResponse>(response);
}

export async function changePassword(
  payload: ChangePasswordPayload
): Promise<ChangePasswordApiResponse> {
  const response = await fetchWithAuth(
    `${API_BASE_URL}${API_ENDPOINTS.USERS.CHANGE_PASSWORD}`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    }
  );

  return handleResponse<ChangePasswordApiResponse>(response);
}

export async function updateAvatar(
  payload: UpdateAvatarPayload
): Promise<UpdateAvatarApiResponse> {
  const token = tokenStorage.getToken();

  const formData = new FormData();
  formData.append("file", payload.file);

  const response = await fetchWithAuth(
    `${API_BASE_URL}${API_ENDPOINTS.USERS.UPDATE_AVATAR}`,
    {
      method: "PUT",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    }
  );

  return handleResponse<UpdateAvatarApiResponse>(response);
}

export async function forgotPassword(
  payload: ForgotPasswordPayload
): Promise<ForgotPasswordApiResponse> {
  const params = new URLSearchParams({ email: payload.email });

  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.USERS.FORGOT_PASSWORD}?${params}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return handleResponse<ForgotPasswordApiResponse>(response);
}

