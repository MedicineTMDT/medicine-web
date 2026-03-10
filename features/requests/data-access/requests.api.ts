import { tokenStorage } from "@/features/auth";
import { API_BASE_URL, API_ENDPOINTS } from "@/lib/api.cofig";
import type { CreateRequestPayload, RequestPageResponse, RequestResponse } from "../types";

// ============================================
// HTTP Helper
// ============================================

function getAuthHeaders(): HeadersInit {
  const token = tokenStorage.getToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// ============================================
// Request API
// ============================================

/**
 * Submit a new request (ADD / EDIT / QUESTION).
 * Requires an authenticated user; the backend resolves the current user via JWT.
 */
export async function createRequest(
  payload: CreateRequestPayload
): Promise<RequestResponse> {
  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.REQUESTS.CREATE}`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  if (!response.ok || (data.code !== undefined && data.code !== 0 && data.code !== 1000)) {
    throw new Error(data.message ?? "Gửi yêu cầu thất bại");
  }

  // Backend returns the entity directly (no result wrapper for requests)
  return data.result ?? data;
}

/**
 * Get all requests submitted by a specific user (paginated).
 */
export async function getUserRequests(
  userId: string,
  page: number = 0,
  size: number = 10
): Promise<RequestPageResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sort: "id,DESC",
  });

  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.REQUESTS.GET_BY_USER}/${userId}?${params}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? "Không thể tải danh sách yêu cầu");
  }

  // Backend returns Spring Page directly (content, totalElements, etc.)
  return data;
}
