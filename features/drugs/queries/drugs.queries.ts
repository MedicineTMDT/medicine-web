"use client";

import type { ApiError } from "@/features/auth/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
    getAllCategories,
    getAllDrugs,
    getDrugById,
    getDrugsByCategory,
    getTop10Drugs,
    searchDrugs,
} from "../data-access/drugs.api";
import type {
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
