import { z } from "zod";
import type { ApiResponse, UserRole } from "@/features/auth/types";

// ============================================
// Request Schemas (Zod for form validation)
// ============================================

export const editUserSchema = z.object({
  userId: z.string(),
  username: z
    .string()
    .min(5, "Username must be at least 5 characters")
    .max(20, "Username must be at most 20 characters"),
  firstName: z
    .string()
    .min(1, "First name is required")
    .regex(/^[a-zA-Z]+$/, "First name must contain only letters"),
  lastName: z.string().min(1, "Last name is required"),
  avatarImg: z.string().optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(20, "Password must be at most 20 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

// ============================================
// Request Types
// ============================================

export type EditUserFormValues = z.infer<typeof editUserSchema>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export interface EditUserPayload {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  avatarImg?: string;
}

export interface ChangePasswordPayload {
  newPassword: string;
}

export interface UpdateAvatarPayload {
  file: File;
}

export interface ForgotPasswordPayload {
  email: string;
}

// ============================================
// Response Types
// ============================================

export interface UserResponse {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatarImg?: string;
  role: UserRole;
}

// Typed API Responses
export type GetUserApiResponse = ApiResponse<UserResponse>;
export type EditUserApiResponse = ApiResponse<UserResponse>;
export type ChangePasswordApiResponse = ApiResponse<object>;
export type UpdateAvatarApiResponse = ApiResponse<string>;
export type ForgotPasswordApiResponse = ApiResponse<object>;

