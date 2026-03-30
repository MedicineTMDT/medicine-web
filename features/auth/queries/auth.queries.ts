"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  login,
  register,
  logout,
  introspect,
  getUserById,
  verifyEmail,
} from "../data-access/auth.api";
import { tokenStorage } from "@/lib/token-storage";
import type {
  LoginPayload,
  LoginApiResponse,
  RegisterPayload,
  RegisterApiResponse,
  LogoutPayload,
  LogoutApiResponse,
  IntrospectApiResponse,
  UserApiResponse,
  VerifyEmailPayload,
  VerifyEmailApiResponse,
  ApiError,
} from "../types";

// ============================================
// Query Keys
// ============================================

export const authKeys = {
  all: ["auth"] as const,
  introspect: () => [...authKeys.all, "introspect"] as const,
  user: (id: string) => [...authKeys.all, "user", id] as const,
} as const;

// ============================================
// Queries
// ============================================

export function useIntrospect() {
  const token = tokenStorage.getToken();

  return useQuery<IntrospectApiResponse, ApiError>({
    queryKey: authKeys.introspect(),
    queryFn: () => introspect({ token: token! }),
    retry: false,
    enabled: !!token,
  });
}

export function useUser(id: string | undefined) {
  return useQuery<UserApiResponse, ApiError>({
    queryKey: authKeys.user(id!),
    queryFn: () => getUserById(id!),
    retry: false,
    enabled: !!id && !!tokenStorage.getToken(),
  });
}

// ============================================
// Mutations
// ============================================

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation<LoginApiResponse, ApiError, LoginPayload>({
    mutationFn: login,
    onSuccess: (data) => {
      // Invalidate and refetch introspect query
      queryClient.invalidateQueries({ queryKey: authKeys.all });
      // Cache the user data
      if (data.result?.id) {
        queryClient.setQueryData(authKeys.user(data.result.id), {
          code: data.code,
          message: data.message,
          result: data.result,
        });
      }
    },
    onError: () => {
      // Clear any stale data on login failure
      queryClient.removeQueries({ queryKey: authKeys.all });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation<RegisterApiResponse, ApiError, RegisterPayload>({
    mutationFn: register,
    onSuccess: () => {
      // Registration successful - user needs to login separately
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
    onError: () => {
      // Clear any stale data on registration failure
      queryClient.removeQueries({ queryKey: authKeys.all });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation<LogoutApiResponse, ApiError, LogoutPayload>({
    mutationFn: logout,
    onSuccess: () => {
      // Clear all auth-related queries
      queryClient.removeQueries({ queryKey: authKeys.all });
      // Clear the entire cache
      queryClient.clear();
    },
    onSettled: () => {
      // Always clear token, even on error
      tokenStorage.clearToken();
    },
  });
}

export function useVerifyEmail() {
  return useMutation<VerifyEmailApiResponse, ApiError, VerifyEmailPayload>({
    mutationFn: verifyEmail,
  });
}

