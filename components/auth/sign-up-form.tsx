"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, IdCard, Lock, Mail } from "lucide-react";
import { z } from "zod";
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

const signUpSchema = z
  .object({
    name: z.string().min(2, "Please enter your full name"),
    email: z.string().email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Include one uppercase letter")
      .regex(/[0-9]/, "Include one number"),
    confirmPassword: z.string().min(8, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

type SignUpValues = z.infer<typeof signUpSchema>;

const socialProviders = [
  {
    name: "Google",
    icon: GoogleIcon,
    href: "/api/auth/google",
    className: "border border-border/60 bg-white text-secondary hover:bg-muted/50",
  },
];

export function SignUpForm() {
  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const onSubmit = (values: SignUpValues) => {
    console.info("Sign up attempt", values);
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
            Create your AnalyticsPill account
          </span>
          <span className="text-muted-foreground">
            Have an account?{" "}
            <Link
              href="/signin"
              className="font-semibold text-primary hover:underline"
            >
              Sign in
            </Link>
          </span>
        </div>
        <h1 className="text-3xl font-heading font-semibold text-secondary dark:text-white">
          Register
        </h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Dr. Jane Doe"
                    leadingIcon={<IdCard className="h-5 w-5" aria-hidden />}
                    aria-invalid={!!form.formState.errors.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    leadingIcon={<Lock className="h-5 w-5" aria-hidden />}
                    trailingIcon={
                      <button
                        type="button"
                        className="text-muted-foreground transition hover:text-primary"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" aria-hidden />
                        ) : (
                          <Eye className="h-5 w-5" aria-hidden />
                        )}
                      </button>
                    }
                    aria-invalid={!!form.formState.errors.password}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter your password"
                    leadingIcon={<Lock className="h-5 w-5" aria-hidden />}
                    trailingIcon={
                      <button
                        type="button"
                        className="text-muted-foreground transition hover:text-primary"
                        onClick={() => setShowConfirm((prev) => !prev)}
                        aria-label={showConfirm ? "Hide password" : "Show password"}
                      >
                        {showConfirm ? (
                          <EyeOff className="h-5 w-5" aria-hidden />
                        ) : (
                          <Eye className="h-5 w-5" aria-hidden />
                        )}
                      </button>
                    }
                    aria-invalid={!!form.formState.errors.confirmPassword}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" size="lg" className="w-full rounded-full">
            Create account
          </Button>
        </form>
      </Form>

      <div className="mt-6 space-y-4">
        <div className="relative">
          <Separator />
          <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
            Or register with
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
