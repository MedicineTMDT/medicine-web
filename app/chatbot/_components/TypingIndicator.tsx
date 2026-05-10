import React from "react";

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center gap-1.5 p-4 bg-card border border-border rounded-2xl rounded-bl-sm w-fit shadow-sm">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground ml-2 font-medium">Trợ lý AI đang trả lời...</span>
    </div>
  );
};

export default TypingIndicator;
