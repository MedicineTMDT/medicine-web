"use client";

import React, { useState, useEffect } from "react";
import ChatContainer from "./_components/ChatContainer";
import DisclaimerBanner from "./_components/DisclaimerBanner";
import ConversationSidebar from "./_components/ConversationSidebar";
import { useAuth } from "@/features/auth";

export default function ChatbotPage() {
  const { user } = useAuth();
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [refreshSidebar, setRefreshSidebar] = useState(0);

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
    <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
      <div className="mb-8">
        <DisclaimerBanner />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[700px]">
        {/* Sidebar */}
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-6">
          <div className="flex-1 bg-card border border-border shadow-sm rounded-[2.5rem] overflow-hidden">
            <ConversationSidebar 
              userId={user?.id} 
              activeId={activeConversationId} 
              onSelect={setActiveConversationId}
              refreshTrigger={refreshSidebar}
            />
          </div>
          
          <div className="bg-primary/5 border border-primary/20 rounded-[2rem] p-6">
            <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-3">Thông tin hệ thống</h3>
            <p className="text-xs text-muted-foreground/80 leading-relaxed font-medium">
              Mô hình: GPT-4o RAG<br/>
              Cập nhật: Phác đồ BYT 2023-2024<br/>
              Trạng thái: Hoạt động
            </p>
          </div>
        </div>

        {/* Main Chat UI */}
        <div className="lg:col-span-9 h-full">
          <div className="bg-card border border-border shadow-2xl rounded-[3rem] overflow-hidden h-full">
            <ChatContainer 
              userId={user?.id}
              conversationId={activeConversationId}
              onConversationCreated={handleNewConversation}
              onDeleted={handleDeleted}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
