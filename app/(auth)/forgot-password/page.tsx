import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/features/forgot-password";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Recover your AnalyticsPill account and reset your password.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}

