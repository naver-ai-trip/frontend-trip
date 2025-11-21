import { useState, useCallback } from "react";
import { streamMessage, StreamMessageChunk } from "@/lib/api/streamMessage";
import { Message } from "@/types";

interface UseStreamMessageOptions {
  onMessageUpdate?: (message: Message) => void;
  onError?: (error: Error) => void;
}

export function useStreamMessage(options?: UseStreamMessageOptions) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const sendMessage = useCallback(
    async (prompt: string, onMessageReceived: (message: Message) => void) => {
      setIsStreaming(true);
      setError(null);

      let currentMessage: Message | null = null;
      let messageContent = "";
      let messageType: Message["type"] = "text";
      let messageMetadata: Record<string, any> = {};

      const handleChunk = (chunk: StreamMessageChunk) => {
        switch (chunk.type) {
          case "message":
            // Initial message with text content
            messageContent = chunk.content || "";
            if (chunk.data?.message_type) {
              messageType = chunk.data.message_type;
            }
            break;

          case "component":
            // Component data (places_list, timeline, etc.)
            if (chunk.data?.type === "places_list") {
              messageType = "places_list";
              messageMetadata = chunk.data.data || {};
            } else if (chunk.data?.type === "timeline") {
              messageType = "timeline";
              messageMetadata = chunk.data.data || {};
            } else if (chunk.data?.type === "plan") {
              messageType = "plan";
              messageMetadata = chunk.data.data || {};
            }
            break;

          case "action":
            // Actions taken by agent
            if (chunk.data?.actions_taken) {
              messageMetadata.actions_taken = chunk.data.actions_taken;
            }
            break;

          case "suggestion":
            // Next suggestions
            if (chunk.data?.next_suggestions) {
              messageMetadata.next_suggestions = chunk.data.next_suggestions;
            }
            break;

          case "complete":
            // Message is complete, create final message object
            if (!currentMessage) {
              currentMessage = {
                id: Date.now().toString(),
                role: "agent",
                type: messageType,
                content: messageContent,
                metadata: Object.keys(messageMetadata).length > 0 ? messageMetadata : undefined,
                timestamp: new Date(),
              };
              onMessageReceived(currentMessage);
            }
            break;

          case "error":
            setError(new Error(chunk.data?.message || "Unknown error"));
            break;
        }
      };

      try {
        await streamMessage(
          prompt,
          handleChunk,
          () => {
            setIsStreaming(false);
          },
          (err) => {
            setError(err);
            options?.onError?.(err);
            setIsStreaming(false);
          },
        );
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        options?.onError?.(error);
        setIsStreaming(false);
      }
    },
    [options],
  );

  return {
    sendMessage,
    isStreaming,
    error,
    clearError: () => setError(null),
  };
}
