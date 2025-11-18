"use client";

import { Button } from "@/components/ui/button";
import { Paperclip, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
const suggestions = [
  "Create a 7-day itinerary for Japan in spring.",
  "What are the top 5 must-see attractions in Paris?",
  "Suggest a budget-friendly trip to Italy for two weeks.",
  "Find off-the-beaten-path destinations in Southeast Asia.",
];

export const ChatNow = () => {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useRouter();

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSubmit = () => {
    navigate.push("/chat?message=" + encodeURIComponent(input));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleClickSend = () => {
    handleSubmit();
  };

  return (
    <section className="bg-background relative flex min-h-screen w-full flex-col items-center">
      {/* Overlay để làm tối video và chữ nổi bật hơn */}
      <div className="absolute inset-0 z-[1] bg-black/40"></div>

      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full bg-black object-cover object-center"
      >
        <source src="/homepage-bg-video_1.mp4" type="video/mp4" />
      </video>
      <div className="relative z-10">
        <div className="flex flex-col items-center justify-center px-4 py-32 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] [text-shadow:_2px_2px_4px_rgb(0_0_0_/_80%)] sm:text-5xl lg:text-6xl">
            Experience our AI travel assistant
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] [text-shadow:_1px_1px_3px_rgb(0_0_0_/_80%)]">
            Custom trip plans, destination recommendations, and instant travel planning support.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="relative min-w-3xl flex-1 overflow-hidden rounded-xl border bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900/80">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              // disabled={isLoading}
              rows={2}
              className="scrollbar-thin scrollbar-thumb-purple-300 dark:scrollbar-thumb-slate-600 max-h-32 w-full resize-none overflow-y-auto px-4 py-3 text-white placeholder-slate-500 focus:outline-none dark:placeholder-slate-400"
              style={{ minHeight: "44px" }}
            />

            {/* Character count */}
            {input.length > 0 && (
              <div className="absolute top-1 right-2 text-xs text-slate-400">
                {input.length}/2000
              </div>
            )}
            <div className="m-2 flex justify-between">
              <Button variant="secondary" className="text-sm">
                <Paperclip />
                Attach
              </Button>
              <div>
                <Button onClick={handleClickSend} className="" variant="secondary">
                  <Send />
                  Plan my trip
                </Button>
              </div>
            </div>
          </div>
          <div className="z-50 mt-4 flex w-full max-w-4xl flex-wrap items-center justify-start overflow-x-auto px-4">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setInput(suggestion)}
                className="m-2 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm shadow-md transition hover:bg-white/90 dark:bg-slate-800/80 dark:hover:bg-slate-700/90"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
