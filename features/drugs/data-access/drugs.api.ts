import { tokenStorage } from "@/lib/token-storage";
import type { ApiError } from "@/features/auth/types";
import { API_BASE_URL, API_ENDPOINTS } from "@/lib/api.cofig";
import { fetchWithAuth } from "@/lib/fetch-with-auth";
import type {
    CategoryDetailApiResponse,
    CategoryDetailByCategoryApiResponse,
    CategoryDetailListApiResponse,
    CategoryListApiResponse,
    DrugDetailApiResponse,
    DrugIngredientsApiResponse,
    DrugListApiResponse,
    DrugTop10ApiResponse,
    Pageable,
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
// Drug API Functions
// ============================================

export async function getAllDrugs(
  pageable: Pageable
): Promise<DrugListApiResponse> {
  const params = buildPageableParams(pageable);

  const response = await fetchWithAuth(
    `${API_BASE_URL}${API_ENDPOINTS.DRUGS.GET_ALL}?${params}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  return handleResponse<DrugListApiResponse>(response);
}

export async function getDrugById(id: number): Promise<DrugDetailApiResponse> {
  const response = await fetchWithAuth(
    `${API_BASE_URL}${API_ENDPOINTS.DRUGS.GET_BY_ID}/${id}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  return handleResponse<DrugDetailApiResponse>(response);
}

export async function searchDrugs(
  name: string,
  pageable: Pageable
): Promise<DrugListApiResponse> {
  const params = buildPageableParams(pageable);
  params.set("name", name);

  const response = await fetchWithAuth(
    `${API_BASE_URL}${API_ENDPOINTS.DRUGS.SEARCH}?${params}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  return handleResponse<DrugListApiResponse>(response);
}

export async function getTop10Drugs(name: string): Promise<DrugTop10ApiResponse> {
  const params = new URLSearchParams({ name });

  const response = await fetchWithAuth(
    `${API_BASE_URL}${API_ENDPOINTS.DRUGS.TOP10}?${params}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  return handleResponse<DrugTop10ApiResponse>(response);
}

export async function getDrugIngredients(
  id: number
): Promise<DrugIngredientsApiResponse> {
  const response = await fetchWithAuth(
    `${API_BASE_URL}${API_ENDPOINTS.DRUGS.INGREDIENTS}/${id}/ingredients`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  return handleResponse<DrugIngredientsApiResponse>(response);
}

export async function getDrugsByCategory(
  categoryId: number,
  pageable: Pageable
): Promise<DrugListApiResponse> {
  const params = buildPageableParams(pageable);

  const response = await fetchWithAuth(
    `${API_BASE_URL}${API_ENDPOINTS.DRUGS.BY_CATEGORY}/${categoryId}?${params}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  return handleResponse<DrugListApiResponse>(response);
}

// ============================================
// Category API Functions
// ============================================

export async function getAllCategories(
  pageable: Pageable
): Promise<CategoryListApiResponse> {
  const params = buildPageableParams(pageable);

  const response = await fetchWithAuth(
    `${API_BASE_URL}${API_ENDPOINTS.CATEGORIES.GET_ALL}?${params}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  return handleResponse<CategoryListApiResponse>(response);
}

// ============================================
// CategoryDetail API Functions
// ============================================

/**
 * Get a single category detail by ID
 */
export async function getCategoryDetailById(
  id: number
): Promise<CategoryDetailApiResponse> {
  const response = await fetchWithAuth(
    `${API_BASE_URL}${API_ENDPOINTS.CATEGORY_DETAIL.GET_BY_ID}/${id}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  return handleResponse<CategoryDetailApiResponse>(response);
}

/**
 * Get all category details with pagination
 */
export async function getAllCategoryDetails(
  pageable: Pageable
): Promise<CategoryDetailListApiResponse> {
  const params = buildPageableParams(pageable);

  const response = await fetchWithAuth(
    `${API_BASE_URL}${API_ENDPOINTS.CATEGORY_DETAIL.GET_ALL}?${params}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  return handleResponse<CategoryDetailListApiResponse>(response);
}

/**
 * Get category details by category ID with pagination
 */
export async function getCategoryDetailsByCategory(
  categoryId: number,
  pageable: Pageable
): Promise<CategoryDetailByCategoryApiResponse> {
  const params = buildPageableParams(pageable);

  const response = await fetchWithAuth(
    `${API_BASE_URL}${API_ENDPOINTS.CATEGORY_DETAIL.BY_CATEGORY}/${categoryId}?${params}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  return handleResponse<CategoryDetailByCategoryApiResponse>(response);
}

/**
 * Search category details by name with pagination
 */
export async function searchCategoryDetails(
  name: string,
  pageable: Pageable
): Promise<CategoryDetailByCategoryApiResponse> {
  const params = buildPageableParams(pageable);
  params.set("name", name);

  const response = await fetchWithAuth(
    `${API_BASE_URL}${API_ENDPOINTS.CATEGORY_DETAIL.SEARCH}?${params}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  return handleResponse<CategoryDetailByCategoryApiResponse>(response);
}
