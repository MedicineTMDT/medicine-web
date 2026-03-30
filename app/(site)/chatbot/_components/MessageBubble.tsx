"use client";

import React from "react";
import { User, ShieldCheck, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Message } from "@/lib/types/chatbot";
import SourcesAccordion from "./SourcesAccordion";
import { motion } from "framer-motion";

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isBot = message.role === "bot";
  const isUser = message.role === "user";
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "flex w-full gap-3 mb-6",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div className={cn(
        "w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border",
        isUser ? "bg-primary text-white border-primary/20" : "bg-card text-primary border-border"
      )}>
        {isUser ? <User className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
      </div>

      {/* Bubble Content */}
      <div className={cn(
        "flex flex-col max-w-[85%] md:max-w-[70%]",
        isUser ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "px-4 py-3.5 rounded-[1.5rem] shadow-sm relative",
          isUser 
            ? "bg-primary text-white rounded-tr-sm" 
            : "bg-card border border-border rounded-tl-sm"
        )}>
          {/* Main Message Text */}
          <div className={cn(
            "text-sm md:text-base leading-relaxed whitespace-pre-wrap",
            message.isError && "text-destructive font-medium"
          )}>
            {message.isError && <AlertCircle className="w-4 h-4 inline-block mr-2 mb-0.5" />}
            
            {message.isStreaming && !message.content ? (
              <div className="flex items-center gap-1.5 h-6">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-2.5 h-2.5 rounded-full bg-current opacity-60 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            ) : (
              message.content
            )}
            
            {message.content && message.isStreaming && (
              <span className="inline-block w-0.5 h-[1.1em] bg-current ml-1 align-middle animate-pulse" />
            )}
          </div>

          {/* Sources for Bot Messages */}
          {isBot && message.sources && message.sources.length > 0 && (
            <SourcesAccordion sources={message.sources} />
          )}

          {/* Warning Banner for Bot Messages */}
          {isBot && message.warning && !message.isError && (
            <div className="mt-4 p-2 bg-amber-500/5 border border-amber-500/20 rounded-xl text-[10px] text-amber-600 dark:text-amber-400 font-medium">
              <span className="uppercase font-bold mr-1">Lưu ý:</span>
              {message.warning}
            </div>
          )}
        </div>

        {/* Timestamp */}
        <span className="text-[10px] text-muted-foreground mt-1.5 px-2 font-medium opacity-60">
          {mounted ? message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
        </span>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
