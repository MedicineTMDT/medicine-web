import { tokenStorage } from "@/lib/token-storage";
import type { ApiError } from "@/features/auth/types";
import { API_BASE_URL, API_ENDPOINTS } from "@/lib/api.cofig";
import { fetchWithAuth } from "@/lib/fetch-with-auth";
import type {
    CreatePrescriptionRequest,
    Intake,
    Page,
    Pageable,
    Prescription,
    PrescriptionInfo,
    PrescriptionProjection,
} from "../types";

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

function buildPageableParams(pageable: Pageable): URLSearchParams {
  const params = new URLSearchParams();
  params.set("page", pageable.page.toString());
  params.set("size", pageable.size.toString());
  if (pageable.sort) {
    pageable.sort.forEach((s) => params.append("sort", s));
  }
  return params;
}

function getAuthHeaders(): HeadersInit {
  const token = tokenStorage.getToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// ============================================
// Prescription API Functions
// ============================================

/**
 * Scan a prescription image with AI and extract structured data (MED/ADMIN only)
 * Uses multipart/form-data — do NOT set Content-Type header manually.
 * The backend returns a raw CreatePrescriptionRequest (no APIResponse wrapper).
 */
export async function scanPrescription(
  image: File
): Promise<CreatePrescriptionRequest> {
  const token = tokenStorage.getToken();
  const formData = new FormData();
  formData.append("image", image);

  const response = await fetchWithAuth(
    `${API_BASE_URL}${API_ENDPOINTS.PRESCRIPTIONS.SCAN}`,
    {
      method: "POST",
      headers: {
        // Intentionally NOT setting Content-Type — browser sets multipart boundary automatically
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    }
  );

  if (!response.ok) {
    let errorMsg = "Không thể phân tích ảnh đơn thuốc";
    try {
      const err = await response.json();
      errorMsg = err.message ?? errorMsg;
    } catch (_) {}
    throw new Error(errorMsg);
  }

  const data = await response.json();

  // Backend returns raw object or null on unreadable image
  if (!data) {
    throw new Error("AI không thể đọc được đơn thuốc. Vui lòng thử lại với ảnh rõ hơn.");
  }

  return data as CreatePrescriptionRequest;
}

/**
 * Create a new prescription (MED/ADMIN only)
 */
export async function createPrescription(
  request: CreatePrescriptionRequest
): Promise<{ result: Prescription }> {
  const response = await fetchWithAuth(
    `${API_BASE_URL}${API_ENDPOINTS.PRESCRIPTIONS.CREATE}`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(request),
    }
  );

  return handleResponse<{ result: Prescription }>(response);
}

/**
 * Get prescription by ID
 */
export async function getPrescriptionById(
  id: string
): Promise<{ result: Prescription }> {
  const response = await fetchWithAuth(
    `${API_BASE_URL}${API_ENDPOINTS.PRESCRIPTIONS.GET_BY_ID}/${id}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  return handleResponse<{ result: Prescription }>(response);
}

/**
 * Copy an existing prescription
 */
export async function copyPrescription(
  id: string
): Promise<{ result: Prescription }> {
  const response = await fetchWithAuth(
    `${API_BASE_URL}${API_ENDPOINTS.PRESCRIPTIONS.COPY}/${id}/copy`,
    {
      method: "POST",
      headers: getAuthHeaders(),
    }
  );

  return handleResponse<{ result: Prescription }>(response);
}

/**
 * Search prescriptions by name
 */
export async function searchPrescriptionsByName(
  name: string,
  pageable: Pageable
): Promise<Page<PrescriptionProjection>> {
  const params = buildPageableParams(pageable);
  params.set("name", name);

  const response = await fetchWithAuth(
    `${API_BASE_URL}${API_ENDPOINTS.PRESCRIPTIONS.SEARCH_BY_NAME}?${params}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  return handleResponse<Page<PrescriptionProjection>>(response);
}

/**
 * Search prescriptions by date range
 */
export async function searchPrescriptionsByDate(
  start: string,
  end: string,
  pageable: Pageable
): Promise<Page<PrescriptionProjection>> {
  const params = buildPageableParams(pageable);
  params.set("start", start);
  params.set("end", end);

  const response = await fetchWithAuth(
    `${API_BASE_URL}${API_ENDPOINTS.PRESCRIPTIONS.SEARCH_BY_DATE}?${params}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  return handleResponse<Page<PrescriptionProjection>>(response);
}

/**
 * Review prescription for drug interactions
 */
export async function reviewPrescription(
  drugIds: number[]
): Promise<{ result: PrescriptionInfo }> {
  const params = new URLSearchParams();
  drugIds.forEach((id) => params.append("listDrugIds", id.toString()));

  const response = await fetchWithAuth(
    `${API_BASE_URL}${API_ENDPOINTS.PRESCRIPTIONS.REVIEW}?${params}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  return handleResponse<{ result: PrescriptionInfo }>(response);
}

/**
 * Update intake status (mark as completed)
 */
export async function updateIntakeStatus(
  id: string
): Promise<{ result: Intake }> {
  const response = await fetchWithAuth(
    `${API_BASE_URL}${API_ENDPOINTS.PRESCRIPTIONS.EDIT_INTAKE}/${id}`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
    }
  );

  return handleResponse<{ result: Intake }>(response);
}

/**
 * Accept a prescription (Patient only - via email link)
 */
export async function acceptPrescription(id: string): Promise<void> {
  const response = await fetchWithAuth(
    `${API_BASE_URL}${API_ENDPOINTS.PRESCRIPTIONS.ACCEPT}/${id}/accept`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
    }
  );

  await handleResponse<void>(response);
}

/**
 * Analyze prescription using the chatbot AI.
 * Returns `is_useful: false` when the AI answer is generated from general knowledge
 * rather than from the RAG knowledge base (no relevant documents found).
 */
export async function analyzePrescription(
  prescription: any
): Promise<{ answer: string; is_useful: boolean }> {
  const token = tokenStorage.getToken();
  const response = await fetch(API_ENDPOINTS.CHATBOT.COMPLETION, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({
      question: JSON.stringify(prescription),
    }),
  });

  if (!response.ok) {
    throw new Error("Không thể phân tích đơn thuốc lúc này.");
  }

  return response.json();
}

/**
 * Update the prescription's message (doctor's message or AI analysis)
 */
export async function updatePrescriptionMessage(
  id: string,
  message: string
): Promise<{ result: Prescription }> {
  const response = await fetchWithAuth(
    `${API_BASE_URL}${API_ENDPOINTS.PRESCRIPTIONS.UPDATE_MESSAGE}/${id}/message`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: message, // Sending as raw string body since backend @RequestBody String message
    }
  );

  return handleResponse<{ result: Prescription }>(response);
}
