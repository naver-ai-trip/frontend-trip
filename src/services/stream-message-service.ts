import { Message } from "@/types";

/**
 * Parse stream response data into Message object
 * Handles different component types (places_list, timeline, plan, etc.)
 */
export function parseStreamResponse(data: any): Message {
  const messageId = Date.now().toString();
  const timestamp = new Date();

  // Extract message content
  const messageContent = data.message || "";

  // Determine message type based on components
  let messageType: Message["type"] = "text";
  let metadata: Record<string, any> = {};

  if (data.components && Array.isArray(data.components)) {
    for (const component of data.components) {
      if (component.type === "places_list") {
        messageType = "places_list";
        metadata = component.data || {};
        break;
      } else if (component.type === "timeline") {
        messageType = "timeline";
        metadata = component.data || {};
        break;
      } else if (component.type === "plan") {
        messageType = "plan";
        metadata = component.data || {};
        break;
      }
    }
  }

  // Add actions and suggestions to metadata
  if (data.actions_taken) {
    metadata.actions_taken = data.actions_taken;
  }
  if (data.next_suggestions) {
    metadata.next_suggestions = data.next_suggestions;
  }

  return {
    id: messageId,
    role: "agent",
    type: messageType,
    content: messageContent,
    metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
    timestamp,
  };
}

/**
 * Merge multiple stream chunks into a single message
 * Useful for accumulating streamed data
 */
export function mergeStreamChunks(chunks: any[]): any {
  const merged: any = {
    message: "",
    components: [],
    actions_taken: [],
    next_suggestions: [],
  };

  for (const chunk of chunks) {
    if (chunk.message) {
      merged.message += chunk.message;
    }
    if (chunk.components && Array.isArray(chunk.components)) {
      merged.components.push(...chunk.components);
    }
    if (chunk.actions_taken && Array.isArray(chunk.actions_taken)) {
      merged.actions_taken.push(...chunk.actions_taken);
    }
    if (chunk.next_suggestions && Array.isArray(chunk.next_suggestions)) {
      merged.next_suggestions.push(...chunk.next_suggestions);
    }
  }

  return merged;
}

/**
 * Format stream response for display
 */
export function formatStreamResponse(data: any): {
  message: string;
  hasComponents: boolean;
  componentType?: string;
} {
  const message = data.message || "";
  let hasComponents = false;
  let componentType: string | undefined;

  if (data.components && Array.isArray(data.components) && data.components.length > 0) {
    hasComponents = true;
    componentType = data.components[0].type;
  }

  return {
    message,
    hasComponents,
    componentType,
  };
}
