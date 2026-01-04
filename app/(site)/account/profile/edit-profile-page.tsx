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
import { useAuth } from "@/features/auth";
import { editUserSchema, useEditUser, type EditUserFormValues } from "@/features/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Loader2, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function EditProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { mutate: editUser, isPending, error } = useEditUser();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      userId: user?.id || "",
      username: user?.username || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      avatarImg: "",
    },
  });

  const onSubmit = (values: EditUserFormValues) => {
    setIsSuccess(false);
    editUser(
      {
        userId: values.userId,
        username: values.username,
        firstName: values.firstName,
        lastName: values.lastName,
        avatarImg: values.avatarImg,
      },
      {
        onSuccess: () => {
          setIsSuccess(true);
          setTimeout(() => {
            router.push("/account");
          }, 1500);
        },
      }
    );
  };

  if (!user) return null;

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
          {t("account.editProfile.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("account.editProfile.description")}
        </p>
      </motion.div>

      {/* Form */}
      <motion.div
        className="rounded-xl border border-border/20 bg-white p-6 shadow-sm dark:bg-secondary/80"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {error && (
          <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
            {error.message || t("account.editProfile.error")}
          </div>
        )}

        {isSuccess && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-green-500/50 bg-green-50 p-4 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
            <Check className="h-5 w-5" />
            {t("account.editProfile.success")}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("account.editProfile.username")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t("account.editProfile.username.placeholder")}
                      leadingIcon={<User className="h-4 w-4" aria-hidden />}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormDescription>
                    {t("account.editProfile.username.description")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("account.editProfile.firstName")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t("account.editProfile.firstName.placeholder")}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormDescription>
                      {t("account.editProfile.firstName.description")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("account.editProfile.lastName")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t("account.editProfile.lastName.placeholder")}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormDescription>{t("account.editProfile.lastName.description")}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="text-sm font-medium text-secondary dark:text-white">
                {t("account.editProfile.email")}
              </label>
              <div className="mt-2 rounded-lg border border-border/50 bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
                {user.email}
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                {t("account.editProfile.email.readOnly")}
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("account.editProfile.saving")}
                  </>
                ) : (
                  t("account.editProfile.saveChanges")
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/account")}
                disabled={isPending}
              >
                {t("account.editProfile.cancel")}
              </Button>
            </div>
          </form>
        </Form>
      </motion.div>
    </div>
  );
}


