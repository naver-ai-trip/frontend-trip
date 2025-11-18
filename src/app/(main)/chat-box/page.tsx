"use client";

import { useState } from "react";
import { streamAgentResponse } from "@/lib/api/streamAgent";

export default function ChatBox() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    setMessages((prev) => [...prev, `🧑‍💻 You: ${input}`]);

    await streamAgentResponse(
      input,
      (chunk) => {
        if (chunk.type === "text") {
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last.startsWith("🤖 Agent:")) {
              // Append text to last bot message
              const updated = prev.slice(0, -1);
              return [...updated, last + chunk.content];
            }
            return [...prev, "🤖 Agent: " + chunk.content];
          });
        }
      },
      () => setLoading(false)
    );

    setInput("");
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="border p-4 rounded-lg h-[400px] overflow-y-auto bg-gray-50">
        {messages.map((msg, i) => (
          <p key={i} className="whitespace-pre-wrap my-1">
            {msg}
          </p>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          className="border rounded-md px-3 py-2 flex-1"
          placeholder="Ask the agent..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
          onClick={handleSend}
          disabled={loading || !input}
        >
          {loading ? "Streaming..." : "Send"}
        </button>
      </div>
    </div>
  );
}
