"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { ImageIcon, Mic, Paperclip, Send } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isLoading: boolean
}

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
    }
  }, [input])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      onSendMessage(input)
      setInput("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as React.FormEvent)
    }
  }

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center gap-2 p-1shadow-lg">
          <div className="flex items-center gap-2 pl-1 pb-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-full cursor-pointer"
              title="Attach file"
            >
              <Paperclip className="size-6" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-full cursor-pointer"
              title="Emoji"
            >
              <ImageIcon className="size-6" />
            </Button>
          </div>

          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              disabled={isLoading}
              rows={1}
              className="w-full px-4 py-3 bg-transparent text-foreground placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none resize-none max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300 dark:scrollbar-thumb-slate-600"
              style={{ minHeight: "44px" }}
            />

            {input.length > 0 && (
              <div className="absolute bottom-1 right-2 text-xs text-slate-400">
                {input.length}/2000
              </div>
            )}
          </div>

          <div className="flex items-center gap-4  pl-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-full cursor-pointer"
              title="Voice input"
            >
              <Mic className="size-6" />
            </Button>

            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="h-10 w-10 p-0 rounded-full cursor-pointer "
              title="Send message"
            >
              {isLoading ? (
                <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
