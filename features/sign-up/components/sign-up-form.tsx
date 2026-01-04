"use client";

import { GoogleIcon } from "@/components/icons/google";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    registerRequestSchema,
    useAuth,
    type RegisterRequest,
} from "@/features/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Check, Eye, EyeOff, Loader2, Lock, Mail, User, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

const socialProviders = [
  {
    name: "Google",
    icon: GoogleIcon,
    href: "/oauth2/authorization/google",
  },
];

// Password strength calculation
function usePasswordStrength(password: string) {
  return useMemo(() => {
    const requirements = [
      { label: "At least 6 characters", met: password.length >= 6 },
      { label: "Contains uppercase", met: /[A-Z]/.test(password) },
      { label: "Contains lowercase", met: /[a-z]/.test(password) },
      { label: "Contains number", met: /\d/.test(password) },
    ];
    
    const metCount = requirements.filter(r => r.met).length;
    let strength: "weak" | "fair" | "good" | "strong" = "weak";
    let color = "bg-red-500";
    
    if (metCount >= 4) {
      strength = "strong";
      color = "bg-green-500";
    } else if (metCount >= 3) {
      strength = "good";
      color = "bg-yellow-500";
    } else if (metCount >= 2) {
      strength = "fair";
      color = "bg-orange-500";
    }
    
    return { requirements, metCount, strength, color, percentage: (metCount / 4) * 100 };
  }, [password]);
}

export function SignUpForm() {
  const { register, isRegistering, registerError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<RegisterRequest>({
    resolver: zodResolver(registerRequestSchema),
    defaultValues: {
      username: "",
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
      role: "USER",
    },
  });

  const password = form.watch("password");
  const passwordStrength = usePasswordStrength(password || "");

  const onSubmit = async (values: RegisterRequest) => {
    try {
      await register({
        username: values.username,
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        password: values.password,
        role: values.role,
      });
    } catch {
      // Error is handled by the auth context
    }
  };

  const inputWrapperClass = "relative h-11 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/40 focus-within:border-primary/50 dark:bg-white/5";
  const inputClass = "h-11 text-sm text-white placeholder:text-white/40";

  return (
    <motion.div
      className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-white/[0.08] p-6 shadow-2xl backdrop-blur-xl sm:p-8"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-semibold text-white"
        >
          Create Account
        </motion.h1>
        <motion.span 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-sm text-white/50"
        >
          Have an account?{" "}
          <Link
            href="/signin"
            className="font-semibold text-accent transition hover:text-accent/80"
          >
            Sign in
          </Link>
        </motion.span>
      </div>

      {/* Error message */}
      {registerError && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300 backdrop-blur-sm"
        >
          {registerError.message || "Registration failed. Please try again."}
        </motion.div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Row 1: Username & Email */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-white/70">
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="johndoe"
                      leadingIcon={<User className="h-4 w-4" aria-hidden />}
                      aria-invalid={!!form.formState.errors.username}
                      disabled={isRegistering}
                      wrapperClassName={inputWrapperClass}
                      className={inputClass}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-300" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-white/70">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="you@example.com"
                      leadingIcon={<Mail className="h-4 w-4" aria-hidden />}
                      aria-invalid={!!form.formState.errors.email}
                      disabled={isRegistering}
                      wrapperClassName={inputWrapperClass}
                      className={inputClass}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-300" />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Row 2: First Name & Last Name */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-white/70">
                    First Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="John"
                      aria-invalid={!!form.formState.errors.firstName}
                      disabled={isRegistering}
                      wrapperClassName={inputWrapperClass}
                      className={inputClass}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-300" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-white/70">
                    Last Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Doe"
                      aria-invalid={!!form.formState.errors.lastName}
                      disabled={isRegistering}
                      wrapperClassName={inputWrapperClass}
                      className={inputClass}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-300" />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Row 3: Password & Confirm Password */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-white/70">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Min 6 characters"
                      leadingIcon={<Lock className="h-4 w-4" aria-hidden />}
                      trailingIcon={
                        <button
                          type="button"
                          className="text-white/50 transition hover:text-white"
                          onClick={() => setShowPassword((prev) => !prev)}
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" aria-hidden />
                          ) : (
                            <Eye className="h-4 w-4" aria-hidden />
                          )}
                        </button>
                      }
                      aria-invalid={!!form.formState.errors.password}
                      disabled={isRegistering}
                      wrapperClassName={inputWrapperClass}
                      className={inputClass}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-300" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-white/70">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type={showConfirm ? "text" : "password"}
                      placeholder="Re-enter password"
                      leadingIcon={<Lock className="h-4 w-4" aria-hidden />}
                      trailingIcon={
                        <button
                          type="button"
                          className="text-white/50 transition hover:text-white"
                          onClick={() => setShowConfirm((prev) => !prev)}
                          aria-label={
                            showConfirm ? "Hide password" : "Show password"
                          }
                        >
                          {showConfirm ? (
                            <EyeOff className="h-4 w-4" aria-hidden />
                          ) : (
                            <Eye className="h-4 w-4" aria-hidden />
                          )}
                        </button>
                      }
                      aria-invalid={!!form.formState.errors.confirmPassword}
                      disabled={isRegistering}
                      wrapperClassName={inputWrapperClass}
                      className={inputClass}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-300" />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Password Strength Indicator */}
          {password && password.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-4"
            >
              {/* Strength bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/50">Password strength</span>
                  <span className={`font-medium capitalize ${
                    passwordStrength.strength === "strong" ? "text-green-400" :
                    passwordStrength.strength === "good" ? "text-yellow-400" :
                    passwordStrength.strength === "fair" ? "text-orange-400" :
                    "text-red-400"
                  }`}>
                    {passwordStrength.strength}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${passwordStrength.percentage}%` }}
                    className={`h-full rounded-full ${passwordStrength.color} transition-all`}
                  />
                </div>
              </div>

              {/* Requirements checklist */}
              <div className="grid grid-cols-2 gap-2">
                {passwordStrength.requirements.map((req) => (
                  <div
                    key={req.label}
                    className={`flex items-center gap-2 text-xs ${
                      req.met ? "text-green-400" : "text-white/40"
                    }`}
                  >
                    {req.met ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <X className="h-3 w-3" />
                    )}
                    <span>{req.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Submit & Social section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4 pt-2"
          >
            {/* Submit button */}
            <Button
              type="submit"
              className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
              disabled={isRegistering}
            >
              {isRegistering ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-[10px] uppercase tracking-widest text-white/40">
                or
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            {/* Social login */}
            {socialProviders.map((provider) => {
              const Icon = provider.icon;
              return (
                <Button
                  key={provider.name}
                  type="button"
                  variant="ghost"
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/5 text-white transition-all hover:border-white/20 hover:bg-white/10"
                  disabled={isRegistering}
                  onClick={() => {
                    window.location.href = provider.href;
                  }}
                >
                  <Icon className="mr-3 h-4 w-4" aria-hidden />
                  Continue with {provider.name}
                </Button>
              );
            })}
          </motion.div>

          {/* Terms notice */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-xs text-white/40"
          >
            By creating an account, you agree to our{" "}
            <Link href="/legal/terms" className="text-accent hover:underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/legal/privacy" className="text-accent hover:underline">
              Privacy Policy
            </Link>
          </motion.p>
        </form>
      </Form>
    </motion.div>
  );
}
