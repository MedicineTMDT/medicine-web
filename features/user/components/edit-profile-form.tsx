"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { User, Loader2, Check } from "lucide-react";
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
import { useAuth } from "@/features/auth";
import { useEditUser } from "../queries/user.queries";
import { editUserSchema, type EditUserFormValues } from "../types";
import { useState } from "react";

export function EditProfileForm() {
  const { user } = useAuth();
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
          setTimeout(() => setIsSuccess(false), 3000);
        },
      }
    );
  };

  if (!user) {
    return null;
  }

  return (
    <motion.div
      className="rounded-xl border border-border/20 bg-white p-6 shadow-sm dark:bg-secondary/80"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <h3 className="mb-4 text-lg font-semibold text-secondary dark:text-white">
        Edit Profile
      </h3>

      {error && (
        <div className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error.message || "Failed to update profile."}
        </div>
      )}

      {isSuccess && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-500/50 bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
          <Check className="h-4 w-4" />
          Profile updated successfully!
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    disabled={isPending}
                    wrapperClassName="h-10"
                    className="h-10 text-sm"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

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
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Last Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Doe"
                      disabled={isPending}
                      wrapperClassName="h-10"
                      className="h-10 text-sm"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
      </Form>
    </motion.div>
  );
}

