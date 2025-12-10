"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, User, Lock, Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/icons/google";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  useAuth,
  registerRequestSchema,
  type RegisterRequest,
} from "@/features/auth";

const socialProviders = [
  {
    name: "Google",
    icon: GoogleIcon,
    href: "/oauth2/authorization/google",
    className:
      "border border-border/60 bg-white text-secondary hover:bg-muted/50 dark:bg-slate-800 dark:text-white dark:border-white/20",
  },
];

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

  return (
    <motion.div
      className="w-full max-w-xl rounded-[calc(var(--radius)_+_0.6rem)] border border-border/20 bg-white/95 p-5 shadow-card dark:bg-secondary/80 dark:text-white"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-heading font-semibold text-secondary dark:text-white">
          Create Account
        </h1>
        <span className="text-sm text-muted-foreground">
          Have an account?{" "}
          <Link
            href="/signin"
            className="font-semibold text-primary hover:underline"
          >
            Sign in
          </Link>
        </span>
      </div>

      {registerError && (
        <div className="mb-3 rounded-lg border border-destructive/50 bg-destructive/10 p-2.5 text-sm text-destructive">
          {registerError.message || "Registration failed. Please try again."}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          {/* Row 1: Username & Email */}
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="johndoe"
                      leadingIcon={<User className="h-4 w-4" aria-hidden />}
                      aria-invalid={!!form.formState.errors.username}
                      disabled={isRegistering}
                      wrapperClassName="h-10"
                      className="h-10 text-sm"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="you@example.com"
                      leadingIcon={<Mail className="h-4 w-4" aria-hidden />}
                      aria-invalid={!!form.formState.errors.email}
                      disabled={isRegistering}
                      wrapperClassName="h-10"
                      className="h-10 text-sm"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          {/* Row 2: First Name & Last Name */}
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">First Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="John"
                      aria-invalid={!!form.formState.errors.firstName}
                      disabled={isRegistering}
                      wrapperClassName="h-10"
                      className="h-10 text-sm"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Last Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Doe"
                      aria-invalid={!!form.formState.errors.lastName}
                      disabled={isRegistering}
                      wrapperClassName="h-10"
                      className="h-10 text-sm"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          {/* Row 3: Password & Confirm Password */}
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Min 6 characters"
                      leadingIcon={<Lock className="h-4 w-4" aria-hidden />}
                      trailingIcon={
                        <button
                          type="button"
                          className="text-muted-foreground transition hover:text-primary"
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
                      wrapperClassName="h-10"
                      className="h-10 text-sm"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type={showConfirm ? "text" : "password"}
                      placeholder="Re-enter password"
                      leadingIcon={<Lock className="h-4 w-4" aria-hidden />}
                      trailingIcon={
                        <button
                          type="button"
                          className="text-muted-foreground transition hover:text-primary"
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
                      wrapperClassName="h-10"
                      className="h-10 text-sm"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          {/* Submit & Social */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              className="flex-1 rounded-full"
              disabled={isRegistering}
            >
              {isRegistering ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create account"
              )}
            </Button>

            <div className="flex items-center gap-2">
              <Separator orientation="vertical" className="h-8" />
              <span className="text-xs text-muted-foreground">or</span>
              <Separator orientation="vertical" className="h-8" />
            </div>

            {socialProviders.map((provider) => {
              const Icon = provider.icon;
              return (
                <Button
                  key={provider.name}
                  type="button"
                  variant="outline"
                  className={`rounded-full px-6 ${provider.className}`}
                  disabled={isRegistering}
                  onClick={() => {
                    window.location.href = provider.href;
                  }}
                >
                  <Icon className="mr-2 h-4 w-4" aria-hidden />
                  {provider.name}
                </Button>
              );
            })}
          </div>
        </form>
      </Form>
    </motion.div>
  );
}
