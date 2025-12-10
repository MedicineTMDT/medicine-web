import type { Metadata } from "next";
import { SecurityPage } from "./security-page";

export const metadata: Metadata = {
  title: "Security",
  description: "Manage your account security settings.",
};

export default function Page() {
  return <SecurityPage />;
}

