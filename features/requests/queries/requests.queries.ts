import { useMutation, useQuery } from "@tanstack/react-query";
import { createRequest, getUserRequests } from "../data-access/requests.api";
import type { CreateRequestPayload } from "../types";

// ============================================
// Query keys
// ============================================

export const requestKeys = {
  all: ["requests"] as const,
  byUser: (userId: string) => [...requestKeys.all, "user", userId] as const,
};

// ============================================
// Mutations
// ============================================

/**
 * Mutation hook to submit a new request to the backend.
 * The backend associates the request with the currently authenticated user via JWT.
 */
export function useCreateRequest() {
  return useMutation({
    mutationFn: (payload: CreateRequestPayload) => createRequest(payload),
  });
}

// ============================================
// Queries
// ============================================

/**
 * Query hook to fetch all requests for a given user.
 */
export function useUserRequests(userId: string | undefined, page = 0, size = 10) {
  return useQuery({
    queryKey: [...requestKeys.byUser(userId ?? ""), page, size],
    queryFn: () => getUserRequests(userId!, page, size),
    enabled: !!userId,
  });
}
