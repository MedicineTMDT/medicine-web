import type { Metadata } from "next";
import { Suspense } from "react";
import { VerifyEmailForm } from "@/features/verify-email";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Verify your email address to activate your AnalyticsPill account.",
};

export default function VerifyEmailPage() {
  return (
    <div className="flex w-full justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyEmailForm />
      </Suspense>
    </div>
  );
}

