"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowUp, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (text: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

const MAX_CHARS = 2000;

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading, disabled }) => {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  const handleSend = () => {
    if (!value.trim() || isLoading || disabled) return;
    onSend(value.trim());
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isEmpty = !value.trim();

  return (
    <div className="px-4 pb-2">
      <div className={cn(
        "relative flex flex-col w-full bg-card border border-border shadow-lg rounded-[2rem] transition-all duration-200 focus-within:border-primary/30 focus-within:ring-1 focus-within:ring-primary/20",
        isLoading && "opacity-80"
      )}>
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Hỏi bất cứ điều gì về phác đồ điều trị..."
          maxLength={MAX_CHARS}
          disabled={isLoading || disabled}
          className="w-full bg-transparent border-none focus:ring-0 focus:outline-none resize-none pt-4 pb-3 px-6 text-sm md:text-base leading-relaxed max-h-[200px] custom-scrollbar"
        />

        <div className="flex items-center justify-between px-4 pb-3">
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-all"
              title="Đính kèm tài liệu"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <div className={cn(
              "text-[10px] font-medium transition-opacity ml-2",
              value.length > MAX_CHARS * 0.9 ? "text-destructive" : "text-muted-foreground/50",
              value.length === 0 ? "opacity-0" : "opacity-100"
            )}>
              {value.length} / {MAX_CHARS}
            </div>
          </div>

          <button
            onClick={handleSend}
            disabled={isEmpty || isLoading || disabled}
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full transition-all",
              isEmpty || isLoading || disabled
                ? "bg-muted text-muted-foreground/40 cursor-not-allowed"
                : "bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:scale-105 active:scale-95"
            )}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <ArrowUp className="w-5 h-5 stroke-[2.5]" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};


export default ChatInput;
