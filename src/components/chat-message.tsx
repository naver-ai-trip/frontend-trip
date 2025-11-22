"use client";

import { MessageResponse } from "@/types";
import { ChatContentResponseData } from "@/types/api";
import { Bot, Copy, MoreVertical, ThumbsDown, ThumbsUp, User } from "lucide-react";
import TextMessage from "./message-types/text-message";
import PlacesListMessage from "./message-types/places-list-message";
import { Button } from "./ui/button";

interface ChatMessageProps {
  message: MessageResponse;
  tripId: number;
  trip?: any;
}

export default function ChatMessage({ message, tripId, trip }: ChatMessageProps) {
  const isUser = message.from_role === "user";
  let contentParsed: ChatContentResponseData | null = null;

  const rawContent = message?.content as any;

  // Normalize content: accept both string and object
  if (typeof rawContent === "string") {
    if (!rawContent.trim()) {
      return null;
    }
    try {
      contentParsed = JSON.parse(rawContent) as ChatContentResponseData;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e: any) {
      // If it's not valid JSON, treat as plain text
      contentParsed = null;
    }
  } else if (rawContent && typeof rawContent === "object") {
    contentParsed = rawContent as ChatContentResponseData;
  } else {
    return null;
  }

  const renderContent = () => {
    // If parsing failed but we have plain text content, render it
    if (!contentParsed) {
      if (typeof rawContent === "string") {
        return <TextMessage content={rawContent} />;
      }
      return null;
    }

    switch (message.message_type) {
      case "text":
        return <TextMessage content={contentParsed.message ?? ""} />;
      default:
        // If message exists, show it as text even for other types
        if (contentParsed.message) return <TextMessage content={contentParsed.message} />;
        return null;
    }
  };

  const renderComponents = () => {
    if (!contentParsed || !contentParsed.components || contentParsed.components.length === 0) {
      return null;
    }

    return (
      <>
        {contentParsed.components.map((component, idx) => {
          if (component.type === "places_list") {
            return (
              <div key={`comp-${idx}`} className="mt-3">
                <PlacesListMessage trip={trip} tripId={tripId} components={component.data.places} />
              </div>
            );
          }
          return null;
        })}
      </>
    );
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCopy = () => {
    // navigator.clipboard.writeText(message.content);
  };

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"} group`}>
      {!isUser && (
        <div className="mt-1 flex-shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg ring-2 ring-purple-200 dark:ring-slate-700">
            <Bot className="h-5 w-5 text-white" />
          </div>
        </div>
      )}

      <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-2xl`}>
        <div
          className={`relative max-w-[100%] ${
            isUser
              ? "bg-secondary rounded-3xl rounded-tr-md border shadow-sm transition-shadow hover:shadow-md"
              : "text-foreground rounded-3xl rounded-tl-md border border-purple-100 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
          } px-4 py-2`}
        >
          <div className="break-words">{renderContent()}</div>
          {renderComponents()}
          <div className={`text-xs ${isUser ? "" : "text-slate-400 dark:text-slate-500"}`}>
            {formatTime(new Date(message.created_at))}
          </div>

          <div
            className={`absolute top-0 h-4 w-4 ${
              isUser
                ? "bg-secondary right-0 -mr-2 rounded-br-full"
                : "left-0 -ml-2 rounded-tl-full border-t border-l border-purple-100 bg-white dark:border-slate-700 dark:bg-slate-800"
            }`}
          />
        </div>

        {!isUser && (
          <div className="mt-1.5 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-slate-500 hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-slate-700"
              onClick={handleCopy}
              title="Copy message"
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-slate-500 hover:bg-green-50 hover:text-green-600 dark:hover:bg-slate-700"
              title="Like"
            >
              <ThumbsUp className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-slate-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-slate-700"
              title="Dislike"
            >
              <ThumbsDown className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700"
              title="More options"
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>

      {isUser && (
        <div className="mt-1 flex-shrink-0">
          <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full shadow-lg ring-2 ring-blue-200 dark:ring-slate-700">
            <User className="h-5 w-5 text-white" />
          </div>
        </div>
      )}
    </div>
  );
}
