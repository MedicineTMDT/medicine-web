"use client";

import React, { useState, useEffect } from "react";
import ChatContainer from "./_components/ChatContainer";
import DisclaimerBanner from "./_components/DisclaimerBanner";
import ConversationSidebar from "./_components/ConversationSidebar";
import { useAuth } from "@/features/auth";
import { cn } from "@/lib/utils";

export default function ChatbotPage() {
  const { user } = useAuth();
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [refreshSidebar, setRefreshSidebar] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Restore active ID from local storage if it exists on mount
  useEffect(() => {
    const savedId = localStorage.getItem("chatbot_active_id");
    if (savedId) {
      setActiveConversationId(savedId);
    }
  }, []);

  // Update localStorage when active ID changes
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

  return (
    /* Full viewport height, driven by the chatbot layout (no footer, flex-1 main) */
    <div className="flex flex-col h-full overflow-hidden">
      {/* ── Disclaimer strip ── slim, dismissible, never intrudes on chat */}
      <div className="px-4 pt-3 pb-0 shrink-0">
        <DisclaimerBanner />
      </div>

      {/* ── Main body: sidebar + chat side-by-side, fills all remaining height ── */}
      <div className={cn("flex flex-1 overflow-hidden transition-all duration-300 ease-in-out px-4 py-3 relative", isSidebarOpen ? "lg:gap-3 gap-0" : "gap-0")}>

        {/* Mobile Backdrop Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 z-30 lg:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar — collapsible, full height, scrolls internally */}
        <aside 
          className={cn(
            "flex flex-col shrink-0 transition-all duration-300 ease-in-out overflow-hidden bg-card border border-border shadow-sm rounded-2xl",
            "absolute z-40 inset-y-3 left-4 h-[calc(100%-1.5rem)]", // Mobile styling
            "lg:relative lg:inset-auto lg:h-auto lg:z-auto", // Desktop styling
            isSidebarOpen ? "w-72 opacity-100" : "w-0 opacity-0 border-none pointer-events-none"
          )}
        >
          <div className="flex-1 overflow-hidden">
            <ConversationSidebar
              userId={user?.id}
              activeId={activeConversationId}
              onSelect={(id) => {
                setActiveConversationId(id);
                if (window.innerWidth < 1024) {
                  setIsSidebarOpen(false);
                }
              }}
              refreshTrigger={refreshSidebar}
            />
          </div>
        </aside>

        {/* Chat area — fills all remaining horizontal + vertical space */}
        <div className="flex-1 overflow-hidden bg-card border border-border shadow-2xl rounded-2xl">
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
