import type { Metadata } from "next";
import { AvatarPage } from "./avatar-page";

export const metadata: Metadata = {
  title: "Update Avatar",
  description: "Change your profile picture.",
};

export default function Page() {
  return <AvatarPage />;
}

