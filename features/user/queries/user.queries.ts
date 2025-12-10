"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getUser,
  editUser,
  changePassword,
  updateAvatar,
  forgotPassword,
} from "../data-access/user.api";
import { tokenStorage } from "@/features/auth";
import type {
  GetUserApiResponse,
  EditUserPayload,
  EditUserApiResponse,
  ChangePasswordPayload,
  ChangePasswordApiResponse,
  UpdateAvatarPayload,
  UpdateAvatarApiResponse,
  ForgotPasswordPayload,
  ForgotPasswordApiResponse,
} from "../types";
import type { ApiError } from "@/features/auth/types";

// ============================================
// Query Keys
// ============================================

export const userKeys = {
  all: ["user"] as const,
  detail: (id: string) => [...userKeys.all, "detail", id] as const,
} as const;

// ============================================
// Queries
// ============================================

export function useUser(id: string | undefined) {
  return useQuery<GetUserApiResponse, ApiError>({
    queryKey: userKeys.detail(id!),
    queryFn: () => getUser(id!),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!id && !!tokenStorage.getToken(),
  });
}

// ============================================
// Mutations
// ============================================

export function useEditUser() {
  const queryClient = useQueryClient();

  return useMutation<EditUserApiResponse, ApiError, EditUserPayload>({
    mutationFn: editUser,
    onSuccess: (data, variables) => {
      // Update the user cache
      queryClient.setQueryData(userKeys.detail(variables.userId), data);
      // Also update auth user cache if exists
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}

export function useChangePassword() {
  return useMutation<ChangePasswordApiResponse, ApiError, ChangePasswordPayload>(
    {
      mutationFn: changePassword,
    }
  );
}

export function useUpdateAvatar() {
  const queryClient = useQueryClient();

  return useMutation<UpdateAvatarApiResponse, ApiError, UpdateAvatarPayload>({
    mutationFn: updateAvatar,
    onSuccess: async (data) => {
      // Invalidate user queries to refetch with new avatar
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      
      // The avatar URL is in data.result, but we need to refetch user to get full user object
      // This will trigger the auth context to update via the query cache subscription
    },
  });
}

export function useForgotPassword() {
  return useMutation<ForgotPasswordApiResponse, ApiError, ForgotPasswordPayload>(
    {
      mutationFn: forgotPassword,
    }
  );
}

