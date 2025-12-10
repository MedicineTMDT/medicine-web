"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Camera, Loader2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth";
import { useUpdateAvatar } from "../queries/user.queries";

export function AvatarUpload() {
  const { user } = useAuth();
  const { mutate: updateAvatar, isPending, error } = useUpdateAvatar();
  const [isSuccess, setIsSuccess] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
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
          setTimeout(() => setIsSuccess(false), 3000);
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
    <motion.div
      className="rounded-xl border border-border/20 bg-white p-6 shadow-sm dark:bg-secondary/80"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.15 }}
    >
      <h3 className="mb-4 text-lg font-semibold text-secondary dark:text-white">
        Profile Picture
      </h3>

      {error && (
        <div className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error.message || "Failed to upload avatar."}
        </div>
      )}

      {isSuccess && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-500/50 bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
          <Check className="h-4 w-4" />
          Avatar updated successfully!
        </div>
      )}

      <div className="flex items-center gap-4">
        {/* Current/Preview Avatar */}
        <div className="relative">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-primary/10">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-3xl font-bold text-primary">
                {user.firstName?.[0]?.toUpperCase() ||
                  user.username?.[0]?.toUpperCase() ||
                  "U"}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 rounded-full bg-primary p-2 text-white shadow-lg hover:bg-primary/90"
            disabled={isPending}
          >
            <Camera className="h-4 w-4" />
          </button>
        </div>

        {/* Upload Controls */}
        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {preview ? (
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleUpload}
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Save
                  </>
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                disabled={isPending}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>
          ) : (
            <div>
              <p className="text-sm text-muted-foreground">
                Click the camera icon to upload a new profile picture.
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Supported formats: JPG, PNG, GIF (max 5MB)
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

