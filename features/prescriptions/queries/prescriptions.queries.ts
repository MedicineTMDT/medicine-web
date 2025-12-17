import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    copyPrescription,
    createPrescription,
    getPrescriptionById,
    reviewPrescription,
    searchPrescriptionsByDate,
    searchPrescriptionsByName,
    updateIntakeStatus,
} from "../data-access/prescriptions.api";
import type {
    CreatePrescriptionRequest,
    Pageable,
} from "../types";

// ============================================
// Query Keys
// ============================================

export const prescriptionKeys = {
  all: ["prescriptions"] as const,
  lists: () => [...prescriptionKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...prescriptionKeys.lists(), filters] as const,
  details: () => [...prescriptionKeys.all, "detail"] as const,
  detail: (id: string) => [...prescriptionKeys.details(), id] as const,
  review: (drugIds: number[]) =>
    [...prescriptionKeys.all, "review", drugIds] as const,
};

// ============================================
// Queries
// ============================================

/**
 * Get prescription by ID
 */
export function usePrescriptionById(id: string, enabled = true) {
  return useQuery({
    queryKey: prescriptionKeys.detail(id),
    queryFn: () => getPrescriptionById(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Search prescriptions by name
 */
export function useSearchPrescriptionsByName(
  userId: number,
  name: string,
  pageable: Pageable,
  enabled = true
) {
  return useQuery({
    queryKey: prescriptionKeys.list({ userId, name, ...pageable }),
    queryFn: () => searchPrescriptionsByName(userId, name, pageable),
    enabled: enabled && !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Search prescriptions by date range
 */
export function useSearchPrescriptionsByDate(
  userId: number,
  start: string,
  end: string,
  pageable: Pageable,
  enabled = true
) {
  return useQuery({
    queryKey: prescriptionKeys.list({ userId, start, end, ...pageable }),
    queryFn: () => searchPrescriptionsByDate(userId, start, end, pageable),
    enabled: enabled && !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// ============================================
// Mutations
// ============================================

/**
 * Create prescription mutation (MED/ADMIN only)
 */
export function useCreatePrescription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreatePrescriptionRequest) =>
      createPrescription(request),
    onSuccess: () => {
      // Invalidate prescription lists to refetch
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.lists() });
    },
  });
}

/**
 * Copy prescription mutation
 */
export function useCopyPrescription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => copyPrescription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.lists() });
    },
  });
}

/**
 * Review prescription for drug interactions
 */
export function useReviewPrescription() {
  return useMutation({
    mutationFn: (drugIds: number[]) => reviewPrescription(drugIds),
  });
}

/**
 * Update intake status mutation
 */
export function useUpdateIntakeStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => updateIntakeStatus(id),
    onSuccess: (_, id) => {
      // Invalidate the specific prescription detail
      queryClient.invalidateQueries({ queryKey: prescriptionKeys.details() });
    },
  });
}
