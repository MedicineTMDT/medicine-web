"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { tokenStorage } from "../data-access/auth.api";
import {
  useIntrospect,
  useLogin,
  useLogout,
  useRegister,
} from "../queries/auth.queries";
import type {
  ApiError,
  AuthenticationResponse,
  LoginPayload,
  RegisterPayload,
} from "../types";

// ============================================
// Context Types
// ============================================

interface AuthContextValue {
  // State
  user: AuthenticationResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;

  // Mutation states
  isLoggingIn: boolean;
  isRegistering: boolean;
  isLoggingOut: boolean;
  loginError: ApiError | null;
  registerError: ApiError | null;
}

// ============================================
// Context
// ============================================

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ============================================
// User Storage (for persisting user data)
// ============================================

const USER_KEY = "auth_user";

const userStorage = {
  getUser: (): AuthenticationResponse | null => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  setUser: (user: AuthenticationResponse): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clearUser: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(USER_KEY);
  },
};

// ============================================
// Provider
// ============================================

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<AuthenticationResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Initialize from storage
  useEffect(() => {
    const storedUser = userStorage.getUser();
    const storedToken = tokenStorage.getToken();
    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    }
  }, []);

  // Queries
  const { isLoading: isIntrospectLoading, data: introspectData } =
    useIntrospect();

  // Listen for user data updates (e.g., after avatar upload)
  useEffect(() => {
    if (user?.id) {
      const unsubscribe = queryClient
        .getQueryCache()
        .subscribe((event: any) => {
          if (
            event?.type === "updated" &&
            event.query.queryKey[0] === "user" &&
            event.query.queryKey[2] === user.id
          ) {
            const userData = event.query.state.data as
              | { result: AuthenticationResponse }
              | undefined;
            if (userData?.result) {
              setUser(userData.result);
              userStorage.setUser(userData.result);
            }
          }
        });
      return unsubscribe;
    }
  }, [user?.id, queryClient]);

  // Check if token is still valid on load
  useEffect(() => {
    if (introspectData && !introspectData.result?.valid) {
      // Token is invalid, clear auth state
      tokenStorage.clearToken();
      userStorage.clearUser();
      setUser(null);
      setToken(null);
    }
  }, [introspectData]);

  // Mutations
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  // Derived state
  const isAuthenticated = !!user && !!token;
  const isLoading = isIntrospectLoading;

  // Actions
  const handleLogin = useCallback(
    async (payload: LoginPayload) => {
      const response = await loginMutation.mutateAsync(payload);
      if (response.result) {
        setUser(response.result);
        setToken(response.result.token);
        userStorage.setUser(response.result);
        router.push("/");
      }
    },
    [loginMutation, router]
  );

  const handleRegister = useCallback(
    async (payload: RegisterPayload) => {
      await registerMutation.mutateAsync(payload);
      // After successful registration, redirect to verify email
      router.push(`/verify-email?email=${encodeURIComponent(payload.email)}`);
    },
    [registerMutation, router]
  );

  const handleLogout = useCallback(async () => {
    const currentToken = tokenStorage.getToken();
    if (currentToken) {
      await logoutMutation.mutateAsync({ token: currentToken });
    }
    userStorage.clearUser();
    setUser(null);
    setToken(null);
    router.push("/signin");
  }, [logoutMutation, router]);

  // Context value
  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated,
      isLoading,
      login: handleLogin,
      register: handleRegister,
      logout: handleLogout,
      isLoggingIn: loginMutation.isPending,
      isRegistering: registerMutation.isPending,
      isLoggingOut: logoutMutation.isPending,
      loginError: loginMutation.error,
      registerError: registerMutation.error,
    }),
    [
      user,
      token,
      isAuthenticated,
      isLoading,
      handleLogin,
      handleRegister,
      handleLogout,
      loginMutation.isPending,
      loginMutation.error,
      registerMutation.isPending,
      registerMutation.error,
      logoutMutation.isPending,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ============================================
// Hook
// ============================================

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
