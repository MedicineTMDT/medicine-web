"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, KeyRound, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useVerifyEmail } from "@/features/auth/queries/auth.queries";

export function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromParams = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailFromParams);
  const [token, setToken] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const { mutate: verify, isPending, error } = useVerifyEmail();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    verify(
      { email, token },
      {
        onSuccess: () => {
          setIsSuccess(true);
          // Redirect to login after 2 seconds
          setTimeout(() => {
            router.push("/signin");
          }, 2000);
        },
      }
    );
  };

  if (isSuccess) {
    return (
      <motion.div
        className="w-full max-w-md rounded-[calc(var(--radius)_+_0.6rem)] border border-border/20 bg-white/95 p-8 shadow-card dark:bg-secondary/80 dark:text-white"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-green-100 p-3 dark:bg-green-900/30">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="mb-2 text-2xl font-heading font-semibold text-secondary dark:text-white">
            Email Verified!
          </h1>
          <p className="text-muted-foreground">
            Your email has been verified successfully. Redirecting to sign in...
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="w-full max-w-md rounded-[calc(var(--radius)_+_0.6rem)] border border-border/20 bg-white/95 p-6 shadow-card dark:bg-secondary/80 dark:text-white"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className="mb-6 space-y-2">
        <div className="flex items-center justify-center">
          <div className="rounded-full bg-primary/10 p-3">
            <Mail className="h-6 w-6 text-primary" />
          </div>
        </div>
        <h1 className="text-center text-2xl font-heading font-semibold text-secondary dark:text-white">
          Verify Your Email
        </h1>
        <p className="text-center text-sm text-muted-foreground">
          Enter the verification code sent to your email
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error.message || "Verification failed. Please try again."}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
              disabled={isPending || !!emailFromParams}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="token">Verification Code (OTP)</Label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="token"
              type="text"
              placeholder="Enter code from email"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="pl-10 tracking-widest"
              required
              disabled={isPending}
              autoFocus
            />
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full rounded-full"
          disabled={isPending || !email || !token}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify Email"
          )}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Didn&apos;t receive the code?{" "}
        <button
          type="button"
          className="font-semibold text-primary hover:underline"
          onClick={() => {
            // TODO: Implement resend verification email
            alert("Resend functionality not implemented yet");
          }}
        >
          Resend
        </button>
      </p>
    </motion.div>
  );
}

