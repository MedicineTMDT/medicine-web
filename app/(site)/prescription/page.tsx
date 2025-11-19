import type { Metadata } from "next";
import { PrescriptionPageScreen } from "@/components/pages/prescription-page";

export const metadata: Metadata = {
  title: "Prescription Workspace",
  description: "Role-based prescription builder with interaction checks and patient view.",
};

export default function PrescriptionPage() {
  return <PrescriptionPageScreen />;
}
