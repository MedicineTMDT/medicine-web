"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, Loader2, Check } from "lucide-react";
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
import { useChangePassword } from "../queries/user.queries";
import { changePasswordSchema, type ChangePasswordFormValues } from "../types";

export function ChangePasswordForm() {
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
          setTimeout(() => setIsSuccess(false), 3000);
        },
      }
    );
  };

  return (
    <motion.div
      className="rounded-xl border border-border/20 bg-white p-6 shadow-sm dark:bg-secondary/80"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <h3 className="mb-4 text-lg font-semibold text-secondary dark:text-white">
        Change Password
      </h3>

      {error && (
        <div className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error.message || "Failed to change password."}
        </div>
      )}

      {isSuccess && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-500/50 bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
          <Check className="h-4 w-4" />
          Password changed successfully!
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Current Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type={showCurrent ? "text" : "password"}
                    placeholder="Enter current password"
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
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">New Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type={showNew ? "text" : "password"}
                    placeholder="Enter new password"
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
                <FormLabel className="text-xs">Confirm New Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter new password"
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
                    wrapperClassName="h-10"
                    className="h-10 text-sm"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Changing...
              </>
            ) : (
              "Change Password"
            )}
          </Button>
        </form>
      </Form>
    </motion.div>
  );
}

