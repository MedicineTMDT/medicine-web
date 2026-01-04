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
import { loginRequestSchema, useAuth, type LoginRequest } from "@/features/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

const socialProviders = [
  {
    name: "Google",
    icon: GoogleIcon,
    href: "/oauth2/authorization/google",
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
      className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white/[0.08] p-8 shadow-2xl backdrop-blur-xl"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="mb-8 space-y-3">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between"
        >
          <span className="text-sm font-medium text-white/60">
            Welcome back
          </span>
          <span className="text-sm text-white/50">
            No account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-accent transition hover:text-accent/80"
            >
              Sign up
            </Link>
          </span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-semibold text-white"
        >
          Sign in
        </motion.h1>
      </div>

      {/* Error message */}
      {loginError && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300 backdrop-blur-sm"
        >
          {loginError.message || "Login failed. Please try again."}
        </motion.div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Email field */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-white/70">
                    Email
                  </FormLabel>
                  <FormControl>
                    <div className="group relative">
                      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary/50 to-accent/50 opacity-0 blur transition group-focus-within:opacity-100" />
                      <Input
                        {...field}
                        type="email"
                        placeholder="you@example.com"
                        leadingIcon={<Mail className="h-5 w-5" aria-hidden />}
                        aria-invalid={!!form.formState.errors.email}
                        disabled={isLoggingIn}
                        wrapperClassName="relative h-12 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/40 focus-within:border-primary/50 dark:bg-white/5"
                        className="text-white placeholder:text-white/40"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-300" />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Password field */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-sm font-medium text-white/70">
                      Password
                    </FormLabel>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-medium text-accent transition hover:text-accent/80"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <div className="group relative">
                      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary/50 to-accent/50 opacity-0 blur transition group-focus-within:opacity-100" />
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        leadingIcon={<Lock className="h-5 w-5" aria-hidden />}
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
                              <EyeOff className="h-5 w-5" aria-hidden />
                            ) : (
                              <Eye className="h-5 w-5" aria-hidden />
                            )}
                          </button>
                        }
                        aria-invalid={!!form.formState.errors.password}
                        disabled={isLoggingIn}
                        wrapperClassName="relative h-12 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/40 focus-within:border-primary/50 dark:bg-white/5"
                        className="text-white placeholder:text-white/40"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-300" />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Submit button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              type="submit"
              size="lg"
              className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
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
          </motion.div>
        </form>
      </Form>

      {/* Divider */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="my-4 flex items-center gap-3"
      >
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-[10px] uppercase tracking-widest text-white/40">
          or
        </span>
        <div className="h-px flex-1 bg-white/10" />
      </motion.div>

      {/* Social login */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="space-y-3"
      >
        {socialProviders.map((provider) => {
          const Icon = provider.icon;
          return (
            <Button
              key={provider.name}
              type="button"
              variant="ghost"
              className="h-12 w-full rounded-xl border border-white/10 bg-white/5 text-white transition-all hover:border-white/20 hover:bg-white/10"
              disabled={isLoggingIn}
              onClick={() => {
                window.location.href = provider.href;
              }}
            >
              <Icon className="mr-3 h-5 w-5" aria-hidden />
              Continue with {provider.name}
            </Button>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
