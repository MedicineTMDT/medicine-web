"use client";

import type { ApiError } from "@/features/auth/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
    getDrugInteractionById,
    searchInteractionsByIngredients,
    suggestIngredients,
} from "../data-access/drug-interactions.api";
import type {
    DrugInteractionApiResponse,
    DrugInteractionListApiResponse,
    MergedIngredientListApiResponse,
} from "../types";

// ============================================
// Query Keys
// ============================================

export const drugInteractionKeys = {
  all: ["drugInteractions"] as const,
  detail: (id: number) => [...drugInteractionKeys.all, "detail", id] as const,
  search: (ingredients: string[]) =>
    [...drugInteractionKeys.all, "search", ingredients] as const,
} as const;

export const ingredientKeys = {
  all: ["ingredients"] as const,
  suggestions: (name: string) =>
    [...ingredientKeys.all, "suggestions", name] as const,
} as const;

// ============================================
// Drug Interaction Queries
// ============================================

/**
 * Fetch a single drug interaction by ID
 */
export function useDrugInteraction(id: number | undefined) {
  return useQuery<DrugInteractionApiResponse, ApiError>({
    queryKey: drugInteractionKeys.detail(id!),
    queryFn: () => getDrugInteractionById(id!),
    enabled: id !== undefined,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Mutation for searching drug interactions by ingredient names
 * Uses mutation because it's a user-initiated action, not automatic fetching
 */
export function useSearchInteractions() {
  return useMutation<DrugInteractionListApiResponse, ApiError, string[]>({
    mutationFn: (ingredientNames: string[]) =>
      searchInteractionsByIngredients(ingredientNames),
  });
}

// ============================================
// Ingredient Queries
// ============================================

/**
 * Get ingredient suggestions for autocomplete
 */
export function useIngredientSuggestions(name: string) {
  return useQuery<MergedIngredientListApiResponse, ApiError>({
    queryKey: ingredientKeys.suggestions(name),
    queryFn: () => suggestIngredients(name),
    enabled: name.trim().length >= 2, // Only search when 2+ characters
    staleTime: 30 * 1000, // 30 seconds
  });
}
