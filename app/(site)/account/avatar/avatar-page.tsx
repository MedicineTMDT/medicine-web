"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Camera, Loader2, Check, X, ArrowLeft, Upload, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth";
import { useUpdateAvatar, useUser } from "@/features/user";
import { useQueryClient } from "@tanstack/react-query";

export function AvatarPage() {
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { mutate: updateAvatar, isPending, error } = useUpdateAvatar();
  const [isSuccess, setIsSuccess] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Refetch user data to get updated avatar
  const { data: userData } = useUser(user?.id);
  const currentUser = userData?.result || user;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    setIsSuccess(false);
    updateAvatar(
      { file },
      {
        onSuccess: () => {
          setIsSuccess(true);
          setPreview(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          // Refetch user data to get updated avatar URL
          if (user?.id) {
            queryClient.invalidateQueries({ queryKey: ["user", "detail", user.id] });
            queryClient.invalidateQueries({ queryKey: ["auth"] });
          }
        },
      }
    );
  };

  const handleCancel = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
          Profile Picture
        </h1>
        <p className="text-muted-foreground">
          Upload a new avatar to personalize your profile
        </p>
      </motion.div>

      {/* Current Avatar */}
      <motion.div
        className="rounded-xl border border-border/20 bg-white p-6 shadow-sm dark:bg-secondary/80"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <h3 className="mb-4 font-semibold text-secondary dark:text-white">
          Current Avatar
        </h3>
        <div className="flex items-center gap-6">
          <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary/20 to-primary/5">
            {currentUser?.avatarImg ? (
              <img
                src={currentUser.avatarImg}
                alt={`${currentUser.firstName} ${currentUser.lastName}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-4xl font-bold text-primary">
                {currentUser?.firstName?.[0]?.toUpperCase() ||
                  currentUser?.username?.[0]?.toUpperCase() ||
                  "U"}
              </span>
            )}
          </div>
          <div>
            <p className="font-medium text-secondary dark:text-white">
              {currentUser?.firstName} {currentUser?.lastName}
            </p>
            <p className="text-sm text-muted-foreground">@{currentUser?.username}</p>
          </div>
        </div>
      </motion.div>

      {/* Upload Section */}
      <motion.div
        className="rounded-xl border border-border/20 bg-white p-6 shadow-sm dark:bg-secondary/80"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Image className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-secondary dark:text-white">
              Upload New Avatar
            </h3>
            <p className="text-sm text-muted-foreground">
              Supported formats: JPG, PNG, GIF (max 5MB)
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
            {error.message || "Failed to upload avatar."}
          </div>
        )}

        {isSuccess && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-green-500/50 bg-green-50 p-4 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
            <Check className="h-5 w-5" />
            Avatar updated successfully!
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {preview ? (
          <div className="space-y-4">
            <div className="flex items-center gap-6">
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="h-32 w-32 rounded-full object-cover"
                />
                <button
                  onClick={handleCancel}
                  className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-white shadow-lg hover:bg-destructive/90"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div>
                <p className="font-medium text-secondary dark:text-white">
                  Preview
                </p>
                <p className="text-sm text-muted-foreground">
                  This is how your new avatar will look
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleUpload} disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Avatar
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isPending}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition ${
              dragActive
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-muted/50"
            }`}
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Camera className="h-8 w-8 text-primary" />
            </div>
            <p className="font-medium text-secondary dark:text-white">
              {dragActive ? "Drop your image here" : "Click or drag to upload"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              JPG, PNG or GIF up to 5MB
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

