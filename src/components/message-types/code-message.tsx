 
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

interface CodeMessageProps {
  metadata?: Record<string, any>;
}

export default function CodeMessage({ metadata }: CodeMessageProps) {
  const [copied, setCopied] = useState(false);

  if (!metadata?.code) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(metadata.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
          {metadata.language || "code"}
        </span>
        <Button onClick={handleCopy} size="sm" variant="ghost" className="h-6 px-2 text-xs">
          {copied ? (
            <>
              <Check className="mr-1 h-3 w-3" />
              Đã sao chép
            </>
          ) : (
            <>
              <Copy className="mr-1 h-3 w-3" />
              Sao chép
            </>
          )}
        </Button>
      </div>
      <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 font-mono text-sm leading-relaxed text-slate-100 dark:bg-slate-950">
        <code>{metadata.code}</code>
      </pre>
    </div>
  );
}
