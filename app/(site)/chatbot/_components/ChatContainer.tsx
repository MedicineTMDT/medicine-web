"use client";

import React, { useReducer, useCallback, useRef, useEffect } from "react";
import { RefreshCw, Copy, Trash2, StopCircle } from "lucide-react";
import { Message, DocumentMetadata } from "@/lib/types/chatbot";
import { streamChat, fetchMessages, deleteConversation } from "@/lib/api/chatbot";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";

type State = {
  messages: Message[];
  isLoading: boolean;
};

type Action =
  | { type: "ADD_MESSAGE"; payload: Message }
  | { type: "SET_MESSAGES"; payload: Message[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "APPEND_STREAM_TOKEN"; payload: { id: string; token: string } }
  | { type: "FINALIZE_BOT_MESSAGE"; payload: { id: string; sources?: DocumentMetadata[]; warning?: string; isError?: boolean } }
  | { type: "CLEAR_CHAT" };

const initialState: State = {
  messages: [
    {
      id: "welcome",
      role: "bot",
      content: "Xin chào! Tôi là trợ lý ảo y tế. Tôi có thể giúp bạn tra cứu liều lượng, cách dùng và các lưu ý trong phác đồ điều trị thuốc. Bạn muốn tìm hiểu về thuốc nào hôm nay?",
      timestamp: new Date(),
    }
  ],
  isLoading: false,
};

function chatReducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_MESSAGE":
      return { ...state, messages: [...state.messages, action.payload] };
    case "SET_MESSAGES":
      return { ...state, messages: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "APPEND_STREAM_TOKEN":
      return {
        ...state,
        messages: state.messages.map((m) =>
          m.id === action.payload.id
            ? { ...m, content: m.content + action.payload.token }
            : m
        ),
      };
    case "FINALIZE_BOT_MESSAGE":
      return {
        ...state,
        messages: state.messages.map((m) =>
          m.id === action.payload.id
            ? {
                ...m,
                isStreaming: false,
                sources: action.payload.sources,
                warning: action.payload.warning,
                isError: action.payload.isError ?? m.isError,
              }
            : m
        ),
      };
    case "CLEAR_CHAT":
      return { 
        ...initialState, 
        messages: [{ ...initialState.messages[0], timestamp: new Date() }] 
      };
    default:
      return state;
  }
}

interface ChatContainerProps {
  conversationId: string | null;
  userId?: string;
  onConversationCreated?: (id: string) => void;
  onDeleted?: () => void;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ 
  conversationId, 
  userId,
  onConversationCreated,
  onDeleted 
}) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const abortControllerRef = useRef<AbortController | null>(null);
  const newlyCreatedConvIdRef = useRef<string | null>(null);

  // Load messages when conversationId changes
  useEffect(() => {
    if (conversationId && conversationId === newlyCreatedConvIdRef.current) {
      newlyCreatedConvIdRef.current = null;
      return;
    }

    // Abort any active stream when switching
    abortControllerRef.current?.abort();

    if (!conversationId) {
      dispatch({ type: "CLEAR_CHAT" });
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_MESSAGES", payload: [] });

    fetchMessages(conversationId)
      .then((msgs) => {
        const mappedMessages: Message[] = msgs.map((m) => {
          // Ensure the timestamp is parsed as UTC if the backend sends it without a timezone indicator
          const timeStr = m.created_at.includes('Z') || m.created_at.includes('+') 
            ? m.created_at 
            : `${m.created_at}Z`;
            
          return {
            id: m.id,
            role: m.role === "assistant" ? "bot" : "user",
            content: m.content,
            timestamp: new Date(timeStr),
            sources: m.sources,
          };
        });
        
        // If it's a new empty conversation, we can keep the greeting
        if (mappedMessages.length === 0) {
          dispatch({ type: "CLEAR_CHAT" });
        } else {
          dispatch({ type: "SET_MESSAGES", payload: mappedMessages });
        }
      })
      .catch((err) => {
        console.error("Failed to fetch messages:", err);
      })
      .finally(() => {
        dispatch({ type: "SET_LOADING", payload: false });
      });
  }, [conversationId]);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim() || state.isLoading) return;

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    dispatch({ type: "ADD_MESSAGE", payload: userMessage });
    dispatch({ type: "SET_LOADING", payload: true });

    const botMsgId = crypto.randomUUID();
    dispatch({
      type: "ADD_MESSAGE",
      payload: { id: botMsgId, role: "bot", content: "", timestamp: new Date(), isStreaming: true },
    });

    try {
      await streamChat({
        question: text,
        userId: userId,
        conversationId: conversationId ?? undefined,
        signal: controller.signal,
        onChunk: (chunk) => {
          if (chunk.type === "start" && chunk.conversation_id) {
            if (!conversationId) {
              newlyCreatedConvIdRef.current = chunk.conversation_id;
              onConversationCreated?.(chunk.conversation_id);
            }
          } else if (chunk.type === "stream" && chunk.answer) {
            dispatch({ type: "APPEND_STREAM_TOKEN", payload: { id: botMsgId, token: chunk.answer } });
          } else if (chunk.type === "end") {
            dispatch({ type: "FINALIZE_BOT_MESSAGE", payload: { id: botMsgId, sources: chunk.sources, warning: chunk.warning } });
          } else if (chunk.type === "error") {
            dispatch({ type: "FINALIZE_BOT_MESSAGE", payload: { id: botMsgId, isError: true } });
          }
        },
        onError: (err) => {
          dispatch({ type: "FINALIZE_BOT_MESSAGE", payload: { id: botMsgId, isError: true } });
        },
        onDone: () => {
          dispatch({ type: "SET_LOADING", payload: false });
        },
      });
    } catch (error) {
      // Handled by streamChat callbacks
    }
  }, [state.isLoading, conversationId, onConversationCreated]);

  const handleStop = () => {
    abortControllerRef.current?.abort();
    dispatch({ type: "SET_LOADING", payload: false });
    // Find the last streaming message and finalize it
    const lastMsg = state.messages[state.messages.length - 1];
    if (lastMsg && lastMsg.isStreaming) {
      dispatch({ type: "FINALIZE_BOT_MESSAGE", payload: { id: lastMsg.id } });
    }
  };

  const handleClearChat = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa lịch sử trò chuyện này?")) {
      if (conversationId) {
        try {
          await deleteConversation(conversationId);
          onDeleted?.();
        } catch (e) {
          console.error("Failed to delete conversation", e);
        }
      }
    }
  };

  const handleCopyChat = () => {
    const text = state.messages
      .map((m) => `[${m.role === "user" ? "Bệnh nhân" : "Bác sĩ AI"}] (${m.timestamp.toLocaleTimeString()}): ${m.content}`)
      .join("\n\n");
    navigator.clipboard.writeText(text);
    alert("Đã sao chép lịch sử hội thoại!");
  };

  return (
    <div className="flex flex-col h-[600px] md:h-full bg-background relative">
      {/* Header Actions */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-card/30 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <h1 className="text-sm font-bold tracking-tight text-secondary dark:text-white uppercase transition-all">
            Hệ thống Tư vấn Phác đồ Điều trị
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          {state.isLoading && (
            <button 
              onClick={handleStop}
              className="flex items-center gap-2 px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-lg text-xs font-medium text-muted-foreground transition-colors"
              title="Dừng trả lời"
            >
              <StopCircle className="w-3.5 h-3.5" />
              <span>Dừng</span>
            </button>
          )}
          <button 
            onClick={handleCopyChat}
            className="p-2.5 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-primary"
            title="Sao chép hội thoại"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button 
            onClick={handleClearChat}
            className="p-2.5 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-destructive"
            title="Xóa hội thoại"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute inset-0 flex flex-col">
          <MessageList messages={state.messages} isLoading={state.isLoading} />
        </div>
      </div>

      {/* Input Area */}
      <div className="px-4 md:px-6 py-6 border-t border-border/50 bg-card/20 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto">
          <ChatInput onSend={handleSendMessage} isLoading={state.isLoading} />
          <p className="text-[10px] text-center text-muted-foreground mt-3 font-medium opacity-60">
            Dữ liệu được trích xuất từ các tài liệu chuẩn của Bộ Y tế. Hãy sử dụng có trách nhiệm.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
