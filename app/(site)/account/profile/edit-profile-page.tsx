"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { User, Loader2, Check, ArrowLeft } from "lucide-react";
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
import { useAuth } from "@/features/auth";
import { useEditUser, editUserSchema, type EditUserFormValues } from "@/features/user";

export function EditProfilePage() {
  const router = useRouter();
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
          Back to Account
        </Button>
        <h1 className="text-2xl font-bold text-secondary dark:text-white">
          Edit Profile
        </h1>
        <p className="text-muted-foreground">
          Update your personal information
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
            {error.message || "Failed to update profile."}
          </div>
        )}

        {isSuccess && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-green-500/50 bg-green-50 p-4 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
            <Check className="h-5 w-5" />
            Profile updated successfully! Redirecting...
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="johndoe"
                      leadingIcon={<User className="h-4 w-4" aria-hidden />}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormDescription>
                    Your unique username. Must be 5-20 characters.
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
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="John"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormDescription>
                      Letters only, no spaces or numbers.
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
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Doe"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormDescription>Your family name.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="text-sm font-medium text-secondary dark:text-white">
                Email
              </label>
              <div className="mt-2 rounded-lg border border-border/50 bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
                {user.email}
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Email cannot be changed.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/account")}
                disabled={isPending}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </motion.div>
    </div>
  );
}

