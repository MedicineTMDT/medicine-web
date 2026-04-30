"use client";

import { getMyInfo, getUserInfoFromToken } from "@/features/auth";
import { tokenStorage } from "@/lib/token-storage";
import { motion } from "framer-motion";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function OAuth2SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleOAuth2Success = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setStatus("error");
        setError("No token received from authentication");
        return;
      }

      try {
        // Store the token first
        tokenStorage.setToken(token);

        let userData: Record<string, unknown> | null = null;

        try {
          // Try to fetch full user info from API
          const userResponse = await getMyInfo();
          if (userResponse.result) {
            userData = {
              ...userResponse.result,
              token: token,
              authenticated: true,
            };
          }
        } catch (apiError) {
          console.warn("Could not fetch user from API, trying JWT claims:", apiError);
          
          // Fallback: Extract user info directly from JWT claims
          const jwtUserInfo = getUserInfoFromToken();
          if (jwtUserInfo) {
            userData = {
              id: jwtUserInfo.userId || "",
              email: jwtUserInfo.email || "",
              username: jwtUserInfo.username || jwtUserInfo.email?.split("@")[0] || "",
              firstName: jwtUserInfo.firstName || "",
              lastName: jwtUserInfo.lastName || "",
              role: jwtUserInfo.role || "USER",
              token: token,
              authenticated: true,
            };
            console.log("Using user info from JWT claims:", userData);
          }
        }

        if (userData) {
          localStorage.setItem("auth_user", JSON.stringify(userData));
          setStatus("success");

          // Redirect to home after a short delay
          setTimeout(() => {
            // Force a page reload to refresh auth state
            window.location.href = "/";
          }, 1500);
        } else {
          throw new Error("Could not get user information");
        }
      } catch (err) {
        setStatus("error");
        setError("Failed to process authentication");
        console.error("OAuth2 error:", err);
        // Clear token if processing failed
        tokenStorage.clearToken();
      }
    };

    handleOAuth2Success();
  }, [searchParams, router]);

  return (
    <motion.div
      className="w-full max-w-md rounded-2xl border border-border/20 bg-white/95 p-8 shadow-card dark:bg-secondary/80"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {status === "loading" && (
        <div className="flex flex-col items-center text-center">
          <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />
          <h1 className="mb-2 text-xl font-semibold text-secondary dark:text-white">
            Processing...
          </h1>
          <p className="text-muted-foreground">
            Please wait while we complete your sign-in.
          </p>
        </div>
      )}

      {status === "success" && (
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-green-100 p-3 dark:bg-green-900/30">
            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="mb-2 text-xl font-semibold text-secondary dark:text-white">
            Sign-in Successful!
          </h1>
          <p className="text-muted-foreground">
            Redirecting you to the homepage...
          </p>
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-red-100 p-3 dark:bg-red-900/30">
            <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="mb-2 text-xl font-semibold text-secondary dark:text-white">
            Authentication Failed
          </h1>
          <p className="mb-4 text-muted-foreground">
            {error || "Something went wrong during sign-in."}
          </p>
          <button
            onClick={() => router.push("/signin")}
            className="text-primary hover:underline"
          >
            Back to Sign In
          </button>
        </div>
      )}
    </motion.div>
  );
}

function LoadingFallback() {
  return (
    <div className="w-full max-w-md rounded-2xl border border-border/20 bg-white/95 p-8 shadow-card dark:bg-secondary/80">
      <div className="flex flex-col items-center text-center">
        <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />
        <h1 className="mb-2 text-xl font-semibold text-secondary dark:text-white">
          Loading...
        </h1>
      </div>
    </div>
  );
}

export default function OAuth2SuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Suspense fallback={<LoadingFallback />}>
        <OAuth2SuccessContent />
      </Suspense>
    </div>
  );
}
