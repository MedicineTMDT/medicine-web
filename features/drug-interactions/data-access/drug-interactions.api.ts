import { tokenStorage } from "@/lib/token-storage";
import type { ApiError } from "@/features/auth/types";
import { API_BASE_URL, API_ENDPOINTS } from "@/lib/api.cofig";
import { fetchWithAuth } from "@/lib/fetch-with-auth";
import type {
    DrugInteractionApiResponse,
    DrugInteractionListApiResponse,
    DrugInteractionPagedApiResponse,
    MergedIngredientListApiResponse,
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

function getAuthHeaders(): HeadersInit {
  const token = tokenStorage.getToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// ============================================
// Drug Interaction API Functions
// ============================================

/**
 * Get a single drug interaction by ID
 */
export async function getDrugInteractionById(
  id: number
): Promise<DrugInteractionApiResponse> {
  const response = await fetchWithAuth(
    `${API_BASE_URL}${API_ENDPOINTS.DRUG_INTERACTIONS.GET_BY_ID}/${id}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  return handleResponse<DrugInteractionApiResponse>(response);
}

/**
 * Search drug interactions by ingredient names
 * This is the main API for checking interactions
 * Note: Backend expects GET with body but browsers don't support it,
 * so we pass ingredients as query parameters
 */
export async function searchInteractionsByIngredients(
  ingredientNames: string[]
): Promise<DrugInteractionListApiResponse> {
  // Build URL with ingredients as repeated query params
  const url = new URL(
    `${API_BASE_URL}${API_ENDPOINTS.DRUG_INTERACTIONS.SEARCH_BY_INGREDIENTS}`,
    window.location.origin
  );
  
  // Add each ingredient as a separate query parameter
  ingredientNames.forEach((name) => {
    url.searchParams.append("ingredientNames", name);
  });

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse<DrugInteractionListApiResponse>(response);
}

export async function getDrugInteractionsPaged(
  page = 0,
  size = 12
): Promise<DrugInteractionPagedApiResponse> {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  });
  const response = await fetchWithAuth(
    `${API_BASE_URL}${API_ENDPOINTS.DRUG_INTERACTIONS.GET_BY_ID}?${params}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  return handleResponse<DrugInteractionPagedApiResponse>(response);
}

// ============================================
// Merged Ingredient API Functions
// ============================================

/**
 * Get ingredient suggestions for autocomplete
 */
export async function suggestIngredients(
  name: string
): Promise<MergedIngredientListApiResponse> {
  const params = new URLSearchParams({ name });

  const response = await fetchWithAuth(
    `${API_BASE_URL}${API_ENDPOINTS.MERGED_INGREDIENT.SUGGEST}?${params}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  return handleResponse<MergedIngredientListApiResponse>(response);
}
