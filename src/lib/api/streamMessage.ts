/**
 * Stream message handler for receiving structured stream responses
 * Supports streaming message with components (places_list, etc.)
 */

export interface StreamMessageChunk {
  type: "message" | "component" | "action" | "suggestion" | "complete" | "error";
  data?: any;
  content?: string;
}

export async function streamMessage(
  prompt: string,
  onChunk: (chunk: StreamMessageChunk) => void,
  onComplete?: () => void,
  onError?: (error: Error) => void,
) {
  try {
    const response = await fetch("http://127.0.0.1:5000/stream_chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: prompt }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error("Response body is empty");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Split by double newline to get individual events
      const lines = buffer.split("\n\n");

      // Keep the last incomplete line in buffer
      buffer = lines[lines.length - 1];

      // Process complete lines
      for (let i = 0; i < lines.length - 1; i++) {
        const line = lines[i];
        if (line.startsWith("data: ")) {
          try {
            const jsonStr = line.replace("data: ", "");
            const json = JSON.parse(jsonStr);
            onChunk(json);
          } catch (err) {
            console.error("Parse error:", err, "Line:", line);
          }
        }
      }
    }

    // Process any remaining buffer
    if (buffer.startsWith("data: ")) {
      try {
        const jsonStr = buffer.replace("data: ", "");
        const json = JSON.parse(jsonStr);
        onChunk(json);
      } catch (err) {
        console.error("Parse error:", err);
      }
    }

    onComplete?.();
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("Stream error:", err);
    onError?.(err);
  }
}
