import { Navbar } from "@/components/layout/navbar";
import type { ReactNode } from "react";

/**
 * Chatbot page uses its own layout so it can fill the entire viewport height
 * without the site footer consuming space. The Navbar is kept at the top.
 */
export default function ChatbotLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* Subtle radial background matching site palette */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(0,194,255,0.12),_transparent_45%),radial-gradient(circle_at_top_right,_rgba(2,135,190,0.10),_transparent_45%)]" />
      <Navbar />
      {/* main fills all remaining height without overflow on the page level */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
