import type { ApiResponse } from "@/features/auth/types";

// ============================================
// Pagination Types
// ============================================

export interface Pageable {
  page: number;
  size: number;
  sort?: string[];
}

export interface PageableResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// ============================================
// Drug Types
// ============================================

export interface DrugSimpleResponse {
  id: number;
  name: string;
  slug: string;
  imageLink: string;
}

export interface Drug {
  id: number;
  name: string;
  document: string;
  slug: string;
  metadata: Record<string, unknown>;
  image: string[];
  ingredient: string[];
  info: Record<string, unknown>;
}

// ============================================
// Category Types
// ============================================

export interface CategoryResponse {
  id: number;
  name: string;
  amount: number;
  slug: string;
  created: string;
}

export interface CategorySimpleResponse {
  id: number;
  name: string;
}

// ============================================
// CategoryDetail Types
// ============================================

export interface CategoryDetail {
  id: number;
  name: string;
  content: string;
  created: string;
  update: string;
}

export interface CategoryDetailResponse {
  id: number;
  name: string;
  content: string;
  created: string;
  update: string;
}

// ============================================
// API Response Types
// ============================================

export type DrugListApiResponse = ApiResponse<PageableResponse<DrugSimpleResponse>>;
export type DrugDetailApiResponse = ApiResponse<Drug>;
export type DrugTop10ApiResponse = ApiResponse<DrugSimpleResponse[]>;
export type DrugIngredientsApiResponse = ApiResponse<string[]>;

export type CategoryListApiResponse = ApiResponse<PageableResponse<CategoryResponse>>;
export type CategorySearchApiResponse = ApiResponse<PageableResponse<CategorySimpleResponse>>;

// CategoryDetail API Response Types
export type CategoryDetailApiResponse = ApiResponse<CategoryDetail>;
export type CategoryDetailListApiResponse = ApiResponse<PageableResponse<CategoryDetailResponse>>;
export type CategoryDetailByCategoryApiResponse = ApiResponse<PageableResponse<CategorySimpleResponse>>;
