"use client";

import React, { useState } from "react";
import { ChevronDown, FileText, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

import { DocumentMetadata } from "@/lib/types/chatbot";

interface SourcesAccordionProps {
  sources: DocumentMetadata[];
}

const SourcesAccordion: React.FC<SourcesAccordionProps> = ({ sources }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});

  if (!sources || sources.length === 0) return null;

  const toggleItem = (idx: number) => {
    setExpandedItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const cleanContent = (content: string) => {
    const originalMarker = "; Original: ";
    const markerIndex = content.indexOf(originalMarker);
    if (markerIndex !== -1) {
      return content.substring(markerIndex + originalMarker.length).trim();
    }
    // Fallback: if "Prefix:" exists but not "Original:", try to find where the summary ends
    if (content.startsWith("Prefix: ")) {
      const parts = content.split("; ");
      if (parts.length > 1) return parts.slice(1).join("; ").trim();
    }
    return content;
  };

  return (
    <div className="mt-4 border-t border-border/50 pt-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors mb-2"
      >
        <FileText className="w-3 h-3" />
        <span>Nguồn tài liệu ({sources.length})</span>
        <ChevronDown className={cn("w-3 h-3 transition-transform duration-300 ml-auto", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="space-y-3 animate-in fade-in slide-in-from-top-1 duration-300">
          {sources.map((source, idx) => {
            const cleanedText = cleanContent(source.page_content);
            const isExpanded = !!expandedItems[idx];
            const isLong = cleanedText.length > 300;
            const displayContent = isLong && !isExpanded 
              ? cleanedText.substring(0, 300) + "..." 
              : cleanedText;

            return (
              <div 
                key={`${source.filename}-${idx}`} 
                className="bg-muted/40 rounded-xl p-3 border border-border/40"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-secondary dark:text-white line-clamp-1">
                      {source.filename}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      Trang {source.page_number}
                    </span>
                  </div>
                  {source.source_link ? (
                    <a 
                      href={source.source_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-1.5 bg-primary/10 hover:bg-primary/20 rounded-md transition-colors group"
                      title="Xem phác đồ gốc"
                    >
                      <ExternalLink className="w-3 h-3 text-primary transition-transform group-hover:scale-110" />
                    </a>
                  ) : (
                    <ExternalLink className="w-3 h-3 text-muted-foreground shrink-0 cursor-help" />
                  )}
                </div>
                
                <div className="text-[11px] text-muted-foreground/90 leading-relaxed italic bg-card/40 rounded-lg p-2 border border-border/20 whitespace-pre-wrap">
                  "{displayContent}"
                </div>

                {isLong && (
                  <button
                    onClick={() => toggleItem(idx)}
                    className="mt-2 text-[10px] font-semibold text-primary hover:underline flex items-center gap-1"
                  >
                    {isExpanded ? "Thu gọn" : "Xem thêm"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SourcesAccordion;
