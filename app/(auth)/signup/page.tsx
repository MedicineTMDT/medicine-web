import type { Metadata } from "next";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create an AnalyticsPill account to personalize your medical toolkit.",
};

export default function SignUpPage() {
  return <SignUpForm />;
}
