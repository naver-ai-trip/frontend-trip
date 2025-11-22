import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseSSEStream = async ({
  stream,
  onProgress,
  onResponse,
  onComplete,
}: {
  stream: ReadableStream<Uint8Array>;
  onProgress: (node: string) => void;
  onResponse: (data: any) => void;
  onComplete: () => void;
}) => {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const events = buffer.split("\n\n");

    buffer = events.pop() || "";

    for (const evt of events) {
      if (!evt.trim().startsWith("data:")) continue;

      const jsonString = evt.replace("data: ", "").trim();
      const data = JSON.parse(jsonString);

      if (data.type === "progress") {
        onProgress(data.node);
      }

      if (data.type === "response") {
        onResponse(data.data);
      }

      if (data.type === "complete") {
        console.log("COMPLETE>>>>>>>>>>>>", data);
        onComplete();
      }
    }
  }
};
