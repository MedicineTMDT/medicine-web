import type { Metadata } from "next";
import { EditProfilePage } from "./edit-profile-page";

export const metadata: Metadata = {
  title: "Edit Profile",
  description: "Update your personal information.",
};

export default function ProfilePage() {
  return <EditProfilePage />;
}

