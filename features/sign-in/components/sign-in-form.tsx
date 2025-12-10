"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, Loader2 } from "lucide-react";
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
import { useAuth, loginRequestSchema, type LoginRequest } from "@/features/auth";

const socialProviders = [
  {
    name: "Google",
    icon: GoogleIcon,
    href: "/oauth2/authorization/google",
    className:
      "border border-border/60 bg-white text-secondary hover:bg-muted/50 dark:bg-slate-800 dark:text-white dark:border-white/20",
  },
];

export function SignInForm() {
  const { login, isLoggingIn, loginError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginRequest>({
    resolver: zodResolver(loginRequestSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginRequest) => {
    try {
      await login(values);
    } catch {
      // Error is handled by the auth context
    }
  };

  return (
    <motion.div
      className="w-full max-w-md rounded-[calc(var(--radius)_+_0.6rem)] border border-border/20 bg-white/95 p-6 shadow-card dark:bg-secondary/80 dark:text-white"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className="mb-6 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-muted-foreground">
            Welcome back to AnalyticsPill
          </span>
          <span className="text-muted-foreground">
            No account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-primary hover:underline"
            >
              Sign up
            </Link>
          </span>
        </div>
        <h1 className="text-3xl font-heading font-semibold text-secondary dark:text-white">
          Sign in
        </h1>
      </div>

      {loginError && (
        <div className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {loginError.message || "Login failed. Please try again."}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="you@example.com"
                    leadingIcon={<Mail className="h-5 w-5" aria-hidden />}
                    aria-invalid={!!form.formState.errors.email}
                    disabled={isLoggingIn}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    leadingIcon={<Lock className="h-5 w-5" aria-hidden />}
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
                          <EyeOff className="h-5 w-5" aria-hidden />
                        ) : (
                          <Eye className="h-5 w-5" aria-hidden />
                        )}
                      </button>
                    }
                    aria-invalid={!!form.formState.errors.password}
                    disabled={isLoggingIn}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            size="lg"
            className="w-full rounded-full"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
      </Form>

      <div className="mt-6 space-y-4">
        <div className="relative">
          <Separator />
          <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
            Or sign in with
          </span>
        </div>
        <div className="grid gap-3">
          {socialProviders.map((provider) => {
            const Icon = provider.icon;
            return (
              <Button
                key={provider.name}
                type="button"
                variant="ghost"
                className={`h-12 rounded-2xl text-sm font-semibold transition ${provider.className}`}
                disabled={isLoggingIn}
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
      </div>
    </motion.div>
  );
}

