"use client";

import React, { useEffect, useState } from "react";
import { MessageSquare, Plus, Trash2, Calendar, Loader2 } from "lucide-react";
import { Conversation } from "@/lib/types/chatbot";
import { fetchConversations, deleteConversation } from "@/lib/api/chatbot";
import { cn } from "@/lib/utils";

interface ConversationSidebarProps {
  userId?: string;
  activeId: string | null;
  onSelect: (id: string | null) => void;
  refreshTrigger: number;
}

const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  userId,
  activeId,
  onSelect,
  refreshTrigger,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await fetchConversations(userId);
        // Sort by updated_at descending, handling possible nulls from old bug
        setConversations(data.sort((a, b) => {
          const timeA = a.updated_at ? new Date(a.updated_at).getTime() : 0;
          const timeB = b.updated_at ? new Date(b.updated_at).getTime() : 0;
          return timeB - timeA;
        }));
      } catch (error) {
        console.error("Failed to load conversations", error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [userId, refreshTrigger]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm("Xóa hội thoại này?")) {
      try {
        await deleteConversation(id);
        setConversations(conversations.filter((c) => c.id !== id));
        if (activeId === id) onSelect(null);
      } catch (error) {
        console.error("Failed to delete", error);
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <button
          onClick={() => onSelect(null)}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-200 font-medium text-sm",
            !activeId
              ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
              : "bg-background hover:bg-muted border-border text-foreground"
          )}
        >
          <Plus className="w-4 h-4" />
          <span>Cuộc trò chuyện mới</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 custom-scrollbar">
        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 mb-2">
          Lịch sử trò chuyện
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3">
            <Loader2 className="w-5 h-5 animate-spin opacity-50" />
            <span className="text-xs font-medium">Đang tải...</span>
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-12 px-4 border border-dashed border-border rounded-2xl bg-muted/30">
            <p className="text-xs text-muted-foreground">Chưa có lịch sử trò chuyện nào.</p>
          </div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              className={cn(
                "group relative flex flex-col gap-1 px-4 py-3 rounded-2xl border transition-all cursor-pointer",
                activeId === conv.id
                  ? "bg-primary/5 border-primary/30 shadow-sm"
                  : "bg-card/50 border-border/50 hover:border-primary/20 hover:bg-muted/50"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <span className={cn(
                  "text-sm font-semibold truncate flex-1",
                  activeId === conv.id ? "text-primary" : "text-foreground/80"
                )}>
                  {conv.title || "Cuộc trò chuyện mới"}
                </span>
                <button
                  onClick={(e) => handleDelete(e, conv.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 hover:text-destructive rounded-md transition-all"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <Calendar className="w-3 h-3 opacity-60" />
                <span>{mounted ? new Date(conv.created_at).toLocaleDateString("vi-VN") : ""}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationSidebar;
