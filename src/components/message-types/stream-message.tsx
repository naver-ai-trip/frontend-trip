"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface StreamMessageProps {
  content: string;
  isStreaming?: boolean;
}

/**
 * Component to display streaming message with typing animation
 */
export default function StreamMessage({ content, isStreaming = false }: StreamMessageProps) {
  const [displayedContent, setDisplayedContent] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < content.length) {
      const timer = setTimeout(() => {
        setDisplayedContent((prev) => prev + content[index]);
        setIndex((prev) => prev + 1);
      }, 10); // Adjust speed of typing animation

      return () => clearTimeout(timer);
    }
  }, [index, content]);

  // Reset when content changes
  useEffect(() => {
    setDisplayedContent("");
    setIndex(0);
  }, [content]);

  return (
    <div className="space-y-2">
      <div className="text-foreground break-words whitespace-pre-wrap">
        {displayedContent}
        {isStreaming && <span className="animate-pulse">▌</span>}
      </div>
      {isStreaming && (
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          <span>Streaming response...</span>
        </div>
      )}
    </div>
  );
}
