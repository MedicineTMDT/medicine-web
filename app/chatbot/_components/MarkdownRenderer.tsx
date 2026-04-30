"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={cn(
      "prose prose-sm dark:prose-invert max-w-none transition-all duration-300",
      // Text and paragraph styles
      "prose-p:my-1.5 prose-p:leading-relaxed prose-p:text-inherit",
      // Heading styles
      "prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-inherit",
      "prose-h2:text-base prose-h2:mt-4 prose-h2:mb-2 prose-h2:border-b prose-h2:border-border/50 prose-h2:pb-1",
      "prose-h3:text-sm prose-h3:mt-3 prose-h3:mb-1.5",
      // List styles
      "prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5",
      // Emphasis styles
      "prose-strong:font-black prose-strong:text-inherit",
      // Blockquote styles (for disclaimers/tips)
      "prose-blockquote:not-italic prose-blockquote:border-l-primary/40 prose-blockquote:bg-primary/5 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-xl prose-blockquote:my-3 prose-blockquote:text-[11px] prose-blockquote:text-muted-foreground",
      // Table styles
      "prose-table:my-4 prose-th:px-3 prose-th:py-2 prose-th:bg-muted/50 prose-th:text-left prose-td:px-3 prose-td:py-2 prose-td:border-t prose-td:border-border/50",
      className
    )}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Main table wrapper for horizontal scrolling
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto rounded-2xl border border-border/50 shadow-sm bg-card/50">
              <table className="w-full border-collapse text-xs">
                {children}
              </table>
            </div>
          ),
          // Horizontal rule
          hr: () => <hr className="my-4 border-border/30" />,
          // List item
          li: ({ children }) => (
            <li className="marker:text-primary/60">
              {children}
            </li>
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
