import type { Metadata } from "next";
import { AccountOverview } from "./account-overview";

export const metadata: Metadata = {
  title: "Account",
  description: "View and manage your AnalyticsPill account.",
};

export default function AccountPage() {
  return <AccountOverview />;
}
