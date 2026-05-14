"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useVerifyForgotPassword } from "@/features/auth";
import type { ApiError } from "@/features/auth/types";
import { useChangePassword, useForgotPassword } from "@/features/user/queries/user.queries";
import { tokenStorage } from "@/lib/token-storage";
import { motion } from "framer-motion";
import { CheckCircle2, KeyRound, Loader2, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { z } from "zod";

type ForgotStep = "request" | "verify" | "reset" | "success";

const emailSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

const otpSchema = z.object({
  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "OTP must be exactly 6 digits"),
});

const resetSchema = z
  .object({
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(20, "Password must be at most 20 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export function ForgotPasswordForm() {
  const [step, setStep] = useState<ForgotStep>("request");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const forgotPasswordMutation = useForgotPassword();
  const verifyMutation = useVerifyForgotPassword();
  const changePasswordMutation = useChangePassword();

  const isPending =
    forgotPasswordMutation.isPending ||
    verifyMutation.isPending ||
    changePasswordMutation.isPending;

  const setApiError = (error: ApiError | null) => {
    if (!error) {
      setErrorMessage(null);
      return;
    }
    setErrorMessage(error.message || "Something went wrong. Please try again.");
  };

  const clearErrors = () => {
    setFieldErrors({});
    setErrorMessage(null);
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    const parsed = emailSchema.safeParse({ email });
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      setFieldErrors({ email: issue.message });
      return;
    }

    try {
      await forgotPasswordMutation.mutateAsync({ email: parsed.data.email });
      setStep("verify");
    } catch (error) {
      setApiError(error as ApiError);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    const parsedEmail = emailSchema.safeParse({ email });
    if (!parsedEmail.success) {
      setFieldErrors({ email: "Please enter a valid email first" });
      setStep("request");
      return;
    }

    const parsedOtp = otpSchema.safeParse({ otp });
    if (!parsedOtp.success) {
      const issue = parsedOtp.error.issues[0];
      setFieldErrors({ otp: issue.message });
      return;
    }

    try {
      const response = await verifyMutation.mutateAsync({
        email: parsedEmail.data.email,
        token: parsedOtp.data.otp,
      });

      if (!response.result?.authenticated || !response.result?.token) {
        setErrorMessage("Invalid verification code. Please try again.");
        return;
      }

      setStep("reset");
    } catch (error) {
      setApiError(error as ApiError);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    const parsed = resetSchema.safeParse({ password, confirmPassword });
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (typeof field === "string" && !nextErrors[field]) {
          nextErrors[field] = issue.message;
        }
      });
      setFieldErrors(nextErrors);
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        newPassword: parsed.data.password,
      });
      tokenStorage.clearToken();
      setStep("success");
    } catch (error) {
      setApiError(error as ApiError);
    }
  };

  return (
    <motion.div
      className="w-full max-w-md rounded-[calc(var(--radius)_+_0.6rem)] border border-white/10 bg-white/[0.08] p-6 shadow-2xl backdrop-blur-xl"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className="mb-6 space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-white">Forgot password</h1>
        <p className="text-sm text-white/70">
          {step === "request" && "Enter your email to receive a 6-digit OTP."}
          {step === "verify" && "Enter the OTP sent to your email."}
          {step === "reset" && "Set your new password."}
          {step === "success" && "Your password has been reset successfully."}
        </p>
      </div>

      {errorMessage ? (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {errorMessage}
        </div>
      ) : null}

      {step === "request" && (
        <form onSubmit={handleRequestOtp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="forgot-email" className="text-white/80">
              Email
            </Label>
            <Input
              id="forgot-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leadingIcon={<Mail className="h-4 w-4 text-white/50" aria-hidden />}
              className="text-white placeholder:text-white/40"
              wrapperClassName="rounded-xl border-white/10 bg-white/5 dark:bg-white/5"
              disabled={isPending}
            />
            {fieldErrors.email ? <p className="text-xs text-red-300">{fieldErrors.email}</p> : null}
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-xl border-white/20 bg-transparent text-white hover:bg-white/10"
              asChild
            >
              <Link href="/signin">Cancel</Link>
            </Button>
            <Button type="submit" className="flex-1 rounded-xl" disabled={isPending}>
              {forgotPasswordMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                "Send OTP"
              )}
            </Button>
          </div>
        </form>
      )}

      {step === "verify" && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="space-y-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70">
            <span>OTP sent to:</span>
            <div className="font-medium text-white">{email}</div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="forgot-otp" className="text-white/80">
              Verification code
            </Label>
            <Input
              id="forgot-otp"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              leadingIcon={<KeyRound className="h-4 w-4 text-white/50" aria-hidden />}
              className="tracking-[0.25em] text-white placeholder:text-white/40"
              wrapperClassName="rounded-xl border-white/10 bg-white/5 dark:bg-white/5"
              disabled={isPending}
            />
            {fieldErrors.otp ? <p className="text-xs text-red-300">{fieldErrors.otp}</p> : null}
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl border-white/20 bg-transparent text-white hover:bg-white/10"
              asChild
            >
              <Link href="/signin">Cancel</Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-xl border-white/20 bg-transparent text-white hover:bg-white/10"
              onClick={() => {
                setStep("request");
                setOtp("");
                clearErrors();
              }}
              disabled={isPending}
            >
              Edit email
            </Button>
            <Button type="submit" className="flex-1 rounded-xl" disabled={isPending}>
              {verifyMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </Button>
          </div>
        </form>
      )}

      {step === "reset" && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-password" className="text-white/80">
              New password
            </Label>
            <Input
              id="new-password"
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leadingIcon={<Lock className="h-4 w-4 text-white/50" aria-hidden />}
              className="text-white placeholder:text-white/40"
              wrapperClassName="rounded-xl border-white/10 bg-white/5 dark:bg-white/5"
              disabled={isPending}
            />
            {fieldErrors.password ? <p className="text-xs text-red-300">{fieldErrors.password}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-white/80">
              Confirm password
            </Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              leadingIcon={<Lock className="h-4 w-4 text-white/50" aria-hidden />}
              className="text-white placeholder:text-white/40"
              wrapperClassName="rounded-xl border-white/10 bg-white/5 dark:bg-white/5"
              disabled={isPending}
            />
            {fieldErrors.confirmPassword ? (
              <p className="text-xs text-red-300">{fieldErrors.confirmPassword}</p>
            ) : null}
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-xl border-white/20 bg-transparent text-white hover:bg-white/10"
              asChild
            >
              <Link href="/signin">Cancel</Link>
            </Button>
            <Button type="submit" className="flex-1 rounded-xl" disabled={isPending}>
              {changePasswordMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Reset password"
              )}
            </Button>
          </div>
        </form>
      )}

      {step === "success" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4 text-center"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20">
            <CheckCircle2 className="h-6 w-6 text-emerald-300" />
          </div>
          <p className="text-sm text-white/75">
            Password updated. You can now sign in with your new password.
          </p>
          <Button asChild className="w-full rounded-xl">
            <Link href="/signin">Back to sign in</Link>
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
