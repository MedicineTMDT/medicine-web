"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { ArrowUp, X, FlaskConical, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIngredientSuggestions, type MergedIngredientResponse } from "@/features/drug-interactions";
import { AnimatePresence, motion } from "framer-motion";

interface ChatInputProps {
  onSend: (text: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

const MAX_CHARS = 2000;

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading, disabled }) => {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Mention and Selected Ingredients states
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [mentionSearchQuery, setMentionSearchQuery] = useState("");
  const [mentionStartIndex, setMentionStartIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedIngredients, setSelectedIngredients] = useState<MergedIngredientResponse[]>([]);

  // Fetch suggestions based on query
  const { data: suggestions, isLoading: isSuggestionsLoading } = useIngredientSuggestions(mentionSearchQuery);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  // Handle detection of @ mention when typing
  const checkMention = (text: string, selectionEnd: number) => {
    const textBeforeCursor = text.substring(0, selectionEnd);
    const lastAtIndex = textBeforeCursor.lastIndexOf("@");
    if (lastAtIndex !== -1) {
      // Check if character before @ is a space or start of line
      const charBeforeAt = lastAtIndex > 0 ? textBeforeCursor[lastAtIndex - 1] : "";
      if (charBeforeAt === "" || /\s/.test(charBeforeAt)) {
        const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
        // Ensure no whitespace in the query
        if (!/\s/.test(textAfterAt)) {
          return {
            query: textAfterAt,
            index: lastAtIndex,
          };
        }
      }
    }
    return null;
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setValue(val);

    const selectionEnd = e.target.selectionEnd || 0;
    const mention = checkMention(val, selectionEnd);

    if (mention) {
      setMentionSearchQuery(mention.query);
      setMentionStartIndex(mention.index);
      setShowMentionDropdown(true);
      setSelectedIndex(0);
    } else {
      setShowMentionDropdown(false);
      setMentionSearchQuery("");
      setMentionStartIndex(null);
    }
  };

  // Filter and limit suggestions
  const filteredSuggestions = useMemo(() => {
    if (!suggestions) return [];
    const suggestionList = Array.isArray(suggestions)
      ? suggestions
      : (suggestions as unknown as { result?: MergedIngredientResponse[] })?.result ?? [];
    
    // Filter out already selected ingredients
    return suggestionList
      .filter((s) => !selectedIngredients.some((sel) => sel.id === s.id))
      .slice(0, 6); // Limit to top 6 suggestions
  }, [suggestions, selectedIngredients]);

  const handleSelectSuggestion = (ingredient: MergedIngredientResponse) => {
    if (!textareaRef.current) return;

    const text = value;
    const startIndex = mentionStartIndex ?? 0;
    const selectionEnd = textareaRef.current.selectionEnd || 0;

    // Replace the '@query' with '@IngredientName '
    const mentionText = `@${ingredient.name} `;
    const newText = text.substring(0, startIndex) + mentionText + text.substring(selectionEnd);

    setValue(newText);

    // Add to selected ingredients
    if (!selectedIngredients.some((item) => item.id === ingredient.id)) {
      setSelectedIngredients((prev) => [...prev, ingredient]);
    }

    // Reset mention dropdown
    setShowMentionDropdown(false);
    setMentionSearchQuery("");
    setMentionStartIndex(null);
    setSelectedIndex(0);

    // Refocus textarea and set cursor position
    const newCursorPos = startIndex + mentionText.length;
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 10);
  };

  const handleRemoveIngredient = (id: number) => {
    setSelectedIngredients((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSend = () => {
    if (!value.trim() || isLoading || disabled) return;
    onSend(value.trim());
    setValue("");
    setSelectedIngredients([]); // Reset ingredients after sending
  };

  // Trigger drug interaction check automatically
  const handleCheckInteractions = () => {
    if (selectedIngredients.length < 2 || isLoading || disabled) return;
    const names = selectedIngredients.map((i) => i.name).join(", ");
    onSend(`Kiểm tra tương tác thuốc giữa các hoạt chất: ${names}`);
    setSelectedIngredients([]);
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showMentionDropdown && filteredSuggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredSuggestions.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredSuggestions.length) % filteredSuggestions.length);
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        handleSelectSuggestion(filteredSuggestions[selectedIndex]);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setShowMentionDropdown(false);
        return;
      }
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isEmpty = !value.trim();

  return (
    <div className="px-4 pb-2 relative">
      {/* Mention Dropdown List */}
      <AnimatePresence>
        {showMentionDropdown && mentionSearchQuery.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-4 right-4 z-50 mb-3 max-h-60 overflow-y-auto rounded-2xl border border-border/60 bg-card/95 backdrop-blur-md shadow-2xl custom-scrollbar"
          >
            {isSuggestionsLoading ? (
              <div className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span>Đang tìm kiếm hoạt chất...</span>
              </div>
            ) : filteredSuggestions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-muted-foreground italic">
                Không tìm thấy hoạt chất nào khớp
              </div>
            ) : (
              <div className="py-1">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 border-b border-border/30">
                  Hoạt chất y tế gợi ý
                </div>
                {filteredSuggestions.map((ingredient, idx) => (
                  <button
                    key={ingredient.id}
                    type="button"
                    onClick={() => handleSelectSuggestion(ingredient)}
                    className={cn(
                      "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors",
                      idx === selectedIndex
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-foreground hover:bg-muted/50"
                    )}
                  >
                    <span className="w-2 h-2 rounded-full bg-primary/40" />
                    <span>{ingredient.name}</span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className={cn(
        "relative flex flex-col w-full bg-card border border-border shadow-lg rounded-[2rem] transition-all duration-200 focus-within:border-primary/30 focus-within:ring-1 focus-within:ring-primary/20",
        isLoading && "opacity-80"
      )}>
        {/* Selected Ingredients Pills Section */}
        {selectedIngredients.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 px-6 pt-4 pb-2 border-b border-border/30">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold mr-1">
              <FlaskConical className="w-3.5 h-3.5 text-primary" />
              <span>Hoạt chất đã tag:</span>
            </div>
            {selectedIngredients.map((item) => (
              <span
                key={item.id}
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-xs font-semibold text-primary shadow-sm"
              >
                {item.name}
                <button
                  type="button"
                  onClick={() => handleRemoveIngredient(item.id)}
                  className="rounded-full p-0.5 text-primary/70 hover:bg-primary/20 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}

            {selectedIngredients.length >= 2 && (
              <button
                type="button"
                onClick={handleCheckInteractions}
                disabled={isLoading || disabled}
                className="ml-auto flex items-center gap-1 rounded-full bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white px-3 py-1 text-xs font-bold shadow-md hover:scale-102 active:scale-98 transition-all"
              >
                <FlaskConical className="w-3 h-3" />
                <span>Kiểm tra tương tác ({selectedIngredients.length})</span>
              </button>
            )}
          </div>
        )}

        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder="Hỏi bất cứ điều gì về phác đồ điều trị..."
          maxLength={MAX_CHARS}
          disabled={isLoading || disabled}
          className="w-full bg-transparent border-none focus:ring-0 focus:outline-none resize-none pt-4 pb-3 px-6 text-sm md:text-base leading-relaxed max-h-[200px] custom-scrollbar"
        />

        <div className="flex items-center justify-between px-4 pb-3">
          <div className="flex items-center">
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

