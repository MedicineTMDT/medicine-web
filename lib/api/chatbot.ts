import { ChatStreamChunk, Conversation, ConversationMessage } from "../types/chatbot";

const BASE = process.env.NEXT_PUBLIC_CHATBOT_API_URL ?? "http://localhost:8000";

// ─── Chat Streaming ──────────────────────────────────────────────────────────

export interface StreamChatOptions {
  question: string;
  conversationId?: string;
  userId?: string;
  signal?: AbortSignal;
  onChunk: (chunk: ChatStreamChunk) => void;
  onError: (err: Error) => void;
  onDone: () => void;
}

export async function streamChat({
  question,
  conversationId,
  userId,
  signal,
  onChunk,
  onError,
  onDone,
}: StreamChatOptions): Promise<void> {
  try {
    const res = await fetch(`${BASE}/chat/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question,
        conversation_id: conversationId ?? null,
        user_id: userId ?? null,
      }),
      signal,
    });

    if (!res.ok || !res.body) {
      const text = await res.text().catch(() => "");
      throw new Error(`Lỗi kết nối (${res.status}): ${text}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split("\n\n");
      buffer = parts.pop() ?? "";

      for (const part of parts) {
        const trimmed = part.trim();
        if (!trimmed.startsWith("data:")) continue;

        const json = trimmed.slice("data:".length).trim();
        try {
          const chunk: ChatStreamChunk = JSON.parse(json);
          onChunk(chunk);

          if (chunk.type === "end" || chunk.type === "error") {
            onDone();
            return;
          }
        } catch {
          // Skip malformed SSE lines
        }
      }
    }
    onDone();
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    if (error.name !== "AbortError") {
      onError(error);
    }
    onDone();
  }
}

// ─── Conversations CRUD ──────────────────────────────────────────────────────

export async function createConversation(userId?: string): Promise<Conversation> {
  const res = await fetch(`${BASE}/conversations/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId ?? null, title: "New Conversation" }),
  });
  if (!res.ok) throw new Error("Không thể tạo hội thoại mới");
  return res.json();
}

export async function fetchConversations(userId?: string): Promise<Conversation[]> {
  const params = userId ? `?user_id=${encodeURIComponent(userId)}` : "";
  const res = await fetch(`${BASE}/conversations/${params}`);
  if (!res.ok) throw new Error("Không thể tải danh sách hội thoại");
  return res.json();
}

export async function fetchMessages(conversationId: string): Promise<ConversationMessage[]> {
  const res = await fetch(`${BASE}/conversations/${conversationId}/messages`);
  if (!res.ok) throw new Error("Không thể tải lịch sử hội thoại");
  return res.json();
}

export async function deleteConversation(conversationId: string): Promise<void> {
  const res = await fetch(`${BASE}/conversations/${conversationId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Không thể xóa hội thoại");
}
