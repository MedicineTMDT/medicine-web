"use client";

import React, { useEffect, useRef } from "react";
import { Message } from "@/lib/types/chatbot";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // contained scroll: only scrolls the internal div, never jumps the window
  useEffect(() => {
    if (containerRef.current) {
      const { scrollHeight, clientHeight } = containerRef.current;
      containerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 md:px-6 py-8 scrollbar-hide scroll-smooth"
    >
      <div className="max-w-4xl mx-auto space-y-2">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        
        {isLoading && !messages.some(m => m.isStreaming) && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <TypingIndicator />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageList;
