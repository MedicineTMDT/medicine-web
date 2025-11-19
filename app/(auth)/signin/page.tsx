import type { Metadata } from "next";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Securely access your AnalyticsPill account.",
};

export default function SignInPage() {
  return (
    <div className="flex w-full justify-center">
      <SignInForm />
    </div>
  );
}
