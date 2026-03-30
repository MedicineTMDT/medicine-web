export interface DocumentMetadata {
  filename: string;
  page_number: number;
  page_content: string;
}

export type StreamChunkType = "start" | "stream" | "end" | "error";

export interface ChatStreamChunk {
  type: StreamChunkType;
  conversation_id?: string;
  answer?: string;
  sources?: DocumentMetadata[];
  warning?: string;
}

export interface Conversation {
  id: string;
  user_id?: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ConversationMessage {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
  sources?: DocumentMetadata[];
}

export interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  sources?: DocumentMetadata[];
  warning?: string;
  timestamp: Date;
  isError?: boolean;
  isStreaming?: boolean;
}
