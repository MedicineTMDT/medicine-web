import { z } from "zod";

// ============================================
// Enums
// ============================================

export const UserRole = {
  ADMIN: "ADMIN",
  USER: "USER",
  MED: "MED",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

// ============================================
// Request Schemas (Zod for form validation)
// ============================================

export const loginRequestSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerRequestSchema = z
  .object({
    username: z
      .string()
      .min(5, "Username must be at least 5 characters")
      .max(20, "Username must be at most 20 characters"),
    email: z.string().email("Enter a valid email address"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(20, "Password must be at most 20 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),
    role: z.enum(["ADMIN", "USER", "MED"]).optional().default("USER"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

// ============================================
// Request Types (what gets sent to backend)
// ============================================

export type LoginRequest = z.infer<typeof loginRequestSchema>;

export type RegisterRequest = z.infer<typeof registerRequestSchema>;

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: UserRole;
}

export interface LogoutPayload {
  token: string;
}

export interface IntrospectPayload {
  token: string;
}

export interface VerifyEmailPayload {
  email: string;
  token: string; // OTP code
}

// ============================================
// Response Types (from backend)
// ============================================

// Generic API Response wrapper
export interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

// User Response (from /register, /users/{id})
export interface UserResponse {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatarImg?: string;
  role: UserRole;
}

// Authentication Response (from /login)
export interface AuthenticationResponse {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  token: string;
  authenticated: boolean;
}

// Introspect Response (from /introspect)
export interface IntrospectResponse {
  valid: boolean;
  token: string;
}

// Typed API Responses
export type LoginApiResponse = ApiResponse<AuthenticationResponse>;
export type RegisterApiResponse = ApiResponse<UserResponse>;
export type LogoutApiResponse = ApiResponse<object>;
export type IntrospectApiResponse = ApiResponse<IntrospectResponse>;
export type UserApiResponse = ApiResponse<UserResponse>;
export type VerifyEmailApiResponse = ApiResponse<object>;

// ============================================
// Error Types
// ============================================

export interface ApiError {
  code: number;
  message: string;
  result?: unknown;
}

// ============================================
// Auth State
// ============================================

export interface AuthState {
  user: AuthenticationResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

