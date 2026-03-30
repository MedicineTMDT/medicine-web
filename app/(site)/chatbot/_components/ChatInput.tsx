"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (text: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

const MAX_CHARS = 1000;

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading, disabled }) => {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!value.trim() || isLoading || disabled) return;
    onSend(value.trim());
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [value]);

  const isNearingLimit = value.length > MAX_CHARS * 0.8;

  return (
    <div className="relative group">
      <div className="flex items-end gap-2 bg-card border border-border focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/5 p-2 rounded-3xl transition-all shadow-sm">
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nhập câu hỏi về thuốc hoặc phác đồ điều trị..."
          maxLength={MAX_CHARS}
          disabled={isLoading || disabled}
          className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none focus-visible:outline-none resize-none py-3 px-4 max-h-[120px] text-sm md:text-base leading-relaxed scrollbar-hide"
        />
        
        <button
          onClick={handleSend}
          disabled={!value.trim() || isLoading || disabled}
          className={cn(
            "p-3 rounded-2xl transition-all shrink-0",
            value.trim() && !isLoading 
              ? "bg-primary text-white shadow-md hover:scale-105 active:scale-95" 
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <ArrowUp className="w-5 h-5" />
          )}
        </button>
      </div>
      
      {value.length > 0 && (
        <div className={cn(
          "absolute -top-6 right-4 text-[10px] font-medium transition-opacity",
          isNearingLimit ? "text-destructive" : "text-muted-foreground"
        )}>
          {value.length} / {MAX_CHARS}
        </div>
      )}
    </div>
  );
};

export default ChatInput;
