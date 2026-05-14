"use client";

import React, { useEffect, useState } from "react";
import { Plus, Trash2, Calendar, Loader2 } from "lucide-react";
import { Conversation } from "@/lib/types/chatbot";
import { fetchConversations, deleteConversation } from "@/lib/api/chatbot";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!userId) {
        setConversations([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const data = await fetchConversations(userId);
        setConversations(
          data.sort((a, b) => {
            const timeA = a.updated_at ? new Date(a.updated_at).getTime() : 0;
            const timeB = b.updated_at ? new Date(b.updated_at).getTime() : 0;
            return timeB - timeA;
          })
        );
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
    <div className="flex h-full flex-col">
      <div className="p-4">
        <button
          onClick={() => {
            if (!userId) {
              if (
                window.confirm(
                  "Vui lòng đăng nhập để tạo cuộc trò chuyện mới. Chuyển đến trang đăng nhập?"
                )
              ) {
                router.push("/signin?redirect=/chatbot");
              }
              return;
            }
            onSelect(null);
          }}
          className={cn(
            "flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition-all duration-200",
            !activeId
              ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20"
              : "border-border bg-background text-foreground hover:bg-muted"
          )}
        >
          <Plus className="h-4 w-4" />
          <span>Cuộc trò chuyện mới</span>
        </button>
      </div>

      <div className="custom-scrollbar flex-1 space-y-2 overflow-y-auto px-4 pb-4">
        <div className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Lịch sử trò chuyện
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin opacity-50" />
            <span className="text-xs font-medium">Đang tải...</span>
          </div>
        ) : conversations.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-muted/30 px-4 py-12 text-center dark:border-white/15 dark:bg-white/5">
            <p className="text-xs text-muted-foreground dark:text-white/65">
              Chưa có lịch sử trò chuyện nào.
            </p>
          </div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              className={cn(
                "group relative flex cursor-pointer flex-col gap-1 rounded-2xl border px-4 py-3 transition-all",
                activeId === conv.id
                  ? "border-primary/30 bg-primary/5 shadow-sm"
                  : "border-border/50 bg-card/50 hover:border-primary/20 hover:bg-muted/50"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <span
                  className={cn(
                    "flex-1 truncate text-sm font-semibold",
                    activeId === conv.id ? "text-primary" : "text-foreground/80"
                  )}
                >
                  {conv.title || "Cuộc trò chuyện mới"}
                </span>
                <button
                  onClick={(e) => handleDelete(e, conv.id)}
                  className="rounded-md p-1 opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <Calendar className="h-3 w-3 opacity-60" />
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
