"use client";

import { useTranslation } from "@/components/i18n/translation-provider";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    changePasswordSchema,
    useChangePassword,
    type ChangePasswordFormValues,
} from "@/features/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Eye, EyeOff, Loader2, Lock, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function SecurityPage() {
  const router = useRouter();
  const { t } = useTranslation();
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
          {t("account.editProfile.backToAccount")}
        </Button>
        <h1 className="text-2xl font-bold text-secondary dark:text-white">
          {t("account.security.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("account.security.description")}
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
              {t("account.security.changePassword")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("account.security.changePassword.description")}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
            {error.message || t("account.security.error")}
          </div>
        )}

        {isSuccess && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-green-500/50 bg-green-50 p-4 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
            <Check className="h-5 w-5" />
            {t("account.security.success")}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("account.security.currentPassword")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type={showCurrent ? "text" : "password"}
                      placeholder={t("account.security.currentPassword.placeholder")}
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
                  <FormLabel>{t("account.security.newPassword")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type={showNew ? "text" : "password"}
                      placeholder={t("account.security.newPassword.placeholder")}
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
                    {t("account.security.newPassword.description")}
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
                  <FormLabel>{t("account.security.confirmPassword")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type={showConfirm ? "text" : "password"}
                      placeholder={t("account.security.confirmPassword.placeholder")}
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
                    {t("account.security.updating")}
                  </>
                ) : (
                  t("account.security.updatePassword")
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={isPending}
              >
                {t("account.security.reset")}
              </Button>
            </div>
          </form>
        </Form>
      </motion.div>
    </div>
  );
}


