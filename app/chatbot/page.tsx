"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth";
import { cn } from "@/lib/utils";
import ChatContainer from "./_components/ChatContainer";
import ConversationSidebar from "./_components/ConversationSidebar";
import DisclaimerBanner from "./_components/DisclaimerBanner";

export default function ChatbotPage() {
  const { user, isAuthenticated } = useAuth();
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [refreshSidebar, setRefreshSidebar] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const savedId = localStorage.getItem("chatbot_active_id");
    if (savedId) setActiveConversationId(savedId);
  }, []);

  useEffect(() => {
    if (activeConversationId) {
      localStorage.setItem("chatbot_active_id", activeConversationId);
    } else {
      localStorage.removeItem("chatbot_active_id");
    }
  }, [activeConversationId]);

  const handleNewConversation = (id: string) => {
    setActiveConversationId(id);
    setRefreshSidebar((prev) => prev + 1);
  };

  const handleDeleted = () => {
    setActiveConversationId(null);
    setRefreshSidebar((prev) => prev + 1);
  };

  if (!isAuthenticated) {
    return (
      <div className="relative pb-24">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#04121f]/85 via-[#0a2542]/90 to-[#071b2f]" />
          <div className="container relative flex flex-col items-center gap-6 py-12 text-center text-secondary dark:text-white">
            <div className="mx-auto max-w-2xl space-y-4">
              <h1 className="text-3xl font-heading font-semibold leading-tight text-secondary dark:text-white md:text-4xl">
                Trợ lý AI
              </h1>
              <p className="text-sm text-secondary/80 dark:text-white/80 md:text-base">
                Vui lòng đăng nhập để sử dụng chatbot AI của bạn.
              </p>
              <Button asChild className="mt-4 rounded-full">
                <a href="/signin?redirect=/chatbot">Đăng nhập</a>
              </Button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="shrink-0 px-4 pb-0 pt-3">
        <DisclaimerBanner />
      </div>

      <div
        className={cn(
          "relative flex min-h-0 flex-1 overflow-hidden px-4 py-3 transition-all duration-300 ease-in-out",
          isSidebarOpen ? "gap-0 lg:gap-3" : "gap-0"
        )}
      >
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <aside
          className={cn(
            "absolute inset-y-3 left-4 z-40 flex h-[calc(100%-1.5rem)] shrink-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 ease-in-out",
            "lg:relative lg:inset-auto lg:z-auto lg:h-auto lg:min-h-0",
            isSidebarOpen ? "w-72 opacity-100" : "pointer-events-none w-0 border-none opacity-0"
          )}
        >
          <div className="h-full min-h-0 flex-1 overflow-hidden">
            <ConversationSidebar
              userId={user?.id}
              activeId={activeConversationId}
              onSelect={(id) => {
                setActiveConversationId(id);
                if (window.innerWidth < 1024) setIsSidebarOpen(false);
              }}
              refreshTrigger={refreshSidebar}
            />
          </div>
        </aside>

        <div className="flex-1 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
          <ChatContainer
            userId={user?.id}
            conversationId={activeConversationId}
            onConversationCreated={handleNewConversation}
            onDeleted={handleDeleted}
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        </div>
      </div>
    </div>
  );
}
