import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(0,194,255,0.15),_transparent_45%),radial-gradient(circle_at_top_right,_rgba(2,135,190,0.12),_transparent_45%)]" />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
