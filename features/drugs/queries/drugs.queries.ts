"use client";

import type { ApiError } from "@/features/auth/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
    getAllCategories,
    getAllCategoryDetails,
    getAllDrugs,
    getCategoryDetailById,
    getCategoryDetailsByCategory,
    getDrugById,
    getDrugsByCategory,
    getTop10Drugs,
    searchCategoryDetails,
    searchDrugs,
} from "../data-access/drugs.api";
import type {
    CategoryDetailApiResponse,
    CategoryDetailByCategoryApiResponse,
    CategoryDetailListApiResponse,
    CategoryListApiResponse,
    DrugDetailApiResponse,
    DrugListApiResponse,
    DrugTop10ApiResponse,
    Pageable,
} from "../types";

// ============================================
// Query Keys
// ============================================

export const drugKeys = {
  all: ["drugs"] as const,
  lists: () => [...drugKeys.all, "list"] as const,
  list: (pageable: Pageable) => [...drugKeys.lists(), pageable] as const,
  search: (name: string, pageable: Pageable) =>
    [...drugKeys.all, "search", name, pageable] as const,
  suggestions: (name: string) => [...drugKeys.all, "suggestions", name] as const,
  details: () => [...drugKeys.all, "detail"] as const,
  detail: (id: number) => [...drugKeys.details(), id] as const,
  byCategory: (categoryId: number, pageable: Pageable) =>
    [...drugKeys.all, "byCategory", categoryId, pageable] as const,
} as const;

export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  list: (pageable: Pageable) => [...categoryKeys.lists(), pageable] as const,
} as const;

export const categoryDetailKeys = {
  all: ["categoryDetails"] as const,
  lists: () => [...categoryDetailKeys.all, "list"] as const,
  list: (pageable: Pageable) => [...categoryDetailKeys.lists(), pageable] as const,
  details: () => [...categoryDetailKeys.all, "detail"] as const,
  detail: (id: number) => [...categoryDetailKeys.details(), id] as const,
  byCategory: (categoryId: number, pageable: Pageable) =>
    [...categoryDetailKeys.all, "byCategory", categoryId, pageable] as const,
  search: (name: string, pageable: Pageable) =>
    [...categoryDetailKeys.all, "search", name, pageable] as const,
} as const;

// ============================================
// Drug Queries
// ============================================

/**
 * Fetch paginated list of all drugs
 */
export function useDrugs(pageable: Pageable) {
  return useQuery<DrugListApiResponse, ApiError>({
    queryKey: drugKeys.list(pageable),
    queryFn: () => getAllDrugs(pageable),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch single drug by ID
 */
export function useDrug(id: number | undefined) {
  return useQuery<DrugDetailApiResponse, ApiError>({
    queryKey: drugKeys.detail(id!),
    queryFn: () => getDrugById(id!),
    enabled: id !== undefined,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Search drugs by name with pagination
 */
export function useDrugSearch(name: string, pageable: Pageable) {
  return useQuery<DrugListApiResponse, ApiError>({
    queryKey: drugKeys.search(name, pageable),
    queryFn: () => searchDrugs(name, pageable),
    enabled: name.trim().length > 0,
    placeholderData: keepPreviousData,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Get top 10 drug suggestions for autocomplete
 */
export function useDrugSuggestions(name: string) {
  return useQuery<DrugTop10ApiResponse, ApiError>({
    queryKey: drugKeys.suggestions(name),
    queryFn: () => getTop10Drugs(name),
    enabled: name.trim().length >= 2, // Only search when 2+ characters
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Fetch drugs by category with pagination
 */
export function useDrugsByCategory(
  categoryId: number | undefined,
  pageable: Pageable
) {
  return useQuery<DrugListApiResponse, ApiError>({
    queryKey: drugKeys.byCategory(categoryId!, pageable),
    queryFn: () => getDrugsByCategory(categoryId!, pageable),
    enabled: categoryId !== undefined,
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// ============================================
// Category Queries
// ============================================

/**
 * Fetch paginated list of all categories
 */
export function useCategories(pageable: Pageable) {
  return useQuery<CategoryListApiResponse, ApiError>({
    queryKey: categoryKeys.list(pageable),
    queryFn: () => getAllCategories(pageable),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// ============================================
// CategoryDetail Queries
// ============================================

/**
 * Fetch single category detail by ID
 */
export function useCategoryDetail(id: number | undefined) {
  return useQuery<CategoryDetailApiResponse, ApiError>({
    queryKey: categoryDetailKeys.detail(id!),
    queryFn: () => getCategoryDetailById(id!),
    enabled: id !== undefined,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Fetch paginated list of all category details
 */
export function useCategoryDetails(pageable: Pageable) {
  return useQuery<CategoryDetailListApiResponse, ApiError>({
    queryKey: categoryDetailKeys.list(pageable),
    queryFn: () => getAllCategoryDetails(pageable),
    placeholderData: keepPreviousData,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Fetch category details by category ID with pagination
 */
export function useCategoryDetailsByCategory(
  categoryId: number | undefined,
  pageable: Pageable
) {
  return useQuery<CategoryDetailByCategoryApiResponse, ApiError>({
    queryKey: categoryDetailKeys.byCategory(categoryId!, pageable),
    queryFn: () => getCategoryDetailsByCategory(categoryId!, pageable),
    enabled: categoryId !== undefined,
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Search category details by name with pagination
 */
export function useCategoryDetailSearch(name: string, pageable: Pageable) {
  return useQuery<CategoryDetailByCategoryApiResponse, ApiError>({
    queryKey: categoryDetailKeys.search(name, pageable),
    queryFn: () => searchCategoryDetails(name, pageable),
    enabled: name.trim().length > 0,
    placeholderData: keepPreviousData,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
