import { SignInForm } from "@/features/sign-in";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Securely access your AnalyticsPill account.",
};

export default function SignInPage() {
  return <SignInForm />;
}
