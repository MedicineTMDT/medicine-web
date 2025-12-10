"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, Loader2, Check, ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  useChangePassword,
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "@/features/user";

export function SecurityPage() {
  const router = useRouter();
  const { mutate: changePassword, isPending, error } = useChangePassword();
  const [isSuccess, setIsSuccess] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: ChangePasswordFormValues) => {
    setIsSuccess(false);
    changePassword(
      { newPassword: values.newPassword },
      {
        onSuccess: () => {
          setIsSuccess(true);
          form.reset();
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/account")}
          className="mb-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Account
        </Button>
        <h1 className="text-2xl font-bold text-secondary dark:text-white">
          Security Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your password and security preferences
        </p>
      </motion.div>

      {/* Change Password Form */}
      <motion.div
        className="rounded-xl border border-border/20 bg-white p-6 shadow-sm dark:bg-secondary/80"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-secondary dark:text-white">
              Change Password
            </h3>
            <p className="text-sm text-muted-foreground">
              Update your password to keep your account secure
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
            {error.message || "Failed to change password."}
          </div>
        )}

        {isSuccess && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-green-500/50 bg-green-50 p-4 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
            <Check className="h-5 w-5" />
            Password changed successfully!
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type={showCurrent ? "text" : "password"}
                      placeholder="Enter your current password"
                      leadingIcon={<Lock className="h-4 w-4" aria-hidden />}
                      trailingIcon={
                        <button
                          type="button"
                          onClick={() => setShowCurrent((prev) => !prev)}
                          className="text-muted-foreground hover:text-primary"
                        >
                          {showCurrent ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      }
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type={showNew ? "text" : "password"}
                      placeholder="Enter your new password"
                      leadingIcon={<Lock className="h-4 w-4" aria-hidden />}
                      trailingIcon={
                        <button
                          type="button"
                          onClick={() => setShowNew((prev) => !prev)}
                          className="text-muted-foreground hover:text-primary"
                        >
                          {showNew ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      }
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormDescription>
                    Password must be 6-20 characters long.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type={showConfirm ? "text" : "password"}
                      placeholder="Re-enter your new password"
                      leadingIcon={<Lock className="h-4 w-4" aria-hidden />}
                      trailingIcon={
                        <button
                          type="button"
                          onClick={() => setShowConfirm((prev) => !prev)}
                          className="text-muted-foreground hover:text-primary"
                        >
                          {showConfirm ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      }
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={isPending}
              >
                Reset
              </Button>
            </div>
          </form>
        </Form>
      </motion.div>
    </div>
  );
}

