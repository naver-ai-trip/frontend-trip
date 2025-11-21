"use client";

import TextMessage from "./message-types/text-message";
import ImageMessage from "./message-types/image-message";
import VideoMessage from "./message-types/video-message";
import TimelineMessage from "./message-types/timeline-message";
import PlanMessage from "./message-types/plan-message";
import CodeMessage from "./message-types/code-message";
import PlacesListMessage from "./message-types/places-list-message";
import { Message } from "@/types";
import { Bot, User, Copy, ThumbsUp, ThumbsDown, MoreVertical } from "lucide-react";
import { Button } from "./ui/button";

interface ChatMessageProps {
  message: Message;
  isLoading?: boolean;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  const renderContent = () => {
    switch (message.type) {
      case "text":
        return <TextMessage content={message.content} />;
      case "image":
        return <ImageMessage metadata={message.metadata} />;
      case "video":
        return <VideoMessage metadata={message.metadata} />;
      case "timeline":
        return <TimelineMessage metadata={message.metadata} />;
      case "plan":
        return <PlanMessage metadata={message.metadata} />;
      case "code":
        return <CodeMessage metadata={message.metadata} />;
      case "places_list":
        return <PlacesListMessage metadata={message.metadata} />;
      default:
        return <TextMessage content={message.content} />;
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
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
          className={`relative ${
            isUser
              ? "bg-secondary rounded-3xl rounded-tr-md border shadow-sm transition-shadow hover:shadow-md"
              : "text-foreground rounded-3xl rounded-tl-md border border-purple-100 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
          } px-4 py-2`}
        >
          <div className="break-words">{renderContent()}</div>
          <div className={`text-xs ${isUser ? "" : "text-slate-400 dark:text-slate-500"}`}>
            {formatTime(message.timestamp)}
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
