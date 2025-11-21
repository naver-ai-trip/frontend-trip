"use client";

import ChatInput from "@/components/chat-input";
import ChatMessage from "@/components/chat-message";
import ModernLoader from "@/components/ui/modern-loader";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Booking } from "@/features/chat/booking";
// import { Loading } from "@/features/chat/loading"
import { Overview } from "@/features/chat/overview";
import { SelectCountry } from "@/features/chat/select-country";
import { Message } from "@/types";
import { Bot } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { MapRef } from "react-map-gl/mapbox";
import { useStreamMessage } from "@/hooks/use-stream-message";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "agent",
      type: "text",
      content:
        "Xin chào! 👋 Tôi là AI Assistant của bạn. Tôi có thể giúp bạn với nhiều loại nội dung khác nhau như hình ảnh, video, timeline, kế hoạch, code và nhiều hơn nữa. Hãy thử hỏi tôi điều gì đó!",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState<"overview" | "booking" | "custom">("overview");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapRef | null>(null);
  const params = useSearchParams();
  const router = useRouter();
  // remember last consumed prefilled message to avoid double-send
  const consumedPrefilledRef = useRef<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  // Stream message hook
  const { sendMessage: streamSendMessage } = useStreamMessage({
    onError: (error) => {
      console.error("Stream error:", error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "agent",
        type: "text",
        content: "Sorry, there was an error connecting to the server. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsLoading(false);
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        type: "text",
        content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        await streamSendMessage(content, (message: Message) => {
          setMessages((prev) => [...prev, message]);
          setIsLoading(false);
        });
      } catch (error) {
        console.error("Error calling API:", error);

        // Fallback error message
        const errorMessage: Message = {
          id: Date.now().toString(),
          role: "agent",
          type: "text",
          content: "Sorry, there was an error connecting to the server. Please try again.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        setIsLoading(false);
      }
    },
    [streamSendMessage],
  );

  // consume prefilled message from query param (only once)
  useEffect(() => {
    const prefilledMessage = params.get("message");
    if (prefilledMessage && consumedPrefilledRef.current !== prefilledMessage) {
      consumedPrefilledRef.current = prefilledMessage;
      handleSendMessage(prefilledMessage);
      try {
        router.replace("/chat");
      } catch {
        // ignore
      }
    }
  }, [params, handleSendMessage, router]);

  const handleResize = () => {
    if (mapRef.current) {
      mapRef.current.resize();
    }
  };

  const handleChangeView = (view: "overview" | "booking" | "custom") => {
    setActiveView(view);
  };

  return (
    <div className="flex h-[calc(100vh)] flex-col overflow-hidden border-t">
      <div className="pt-[68px]"></div>
      <main className="flex flex-1 overflow-hidden border-t">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="flex h-full flex-col">
              <div className="flex-1 overflow-y-auto">
                <div className="mx-auto max-w-4xl space-y-4 px-4 py-6">
                  {messages.map((message: Message) => (
                    <ChatMessage isLoading key={message.id} message={message} />
                  ))}
                  {isLoading && (
                    <div className="relative flex gap-4">
                      <div className="mt-1 flex-shrink-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg ring-2 ring-purple-200 dark:ring-slate-700">
                          <Bot className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div
                        className={`text-foreground relative w-fit rounded-3xl rounded-tl-md border border-purple-100 bg-white px-2 py-2 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800`}
                      >
                        <ModernLoader
                          words={[
                            "Planning your journey...",
                            "Finding best destinations...",
                            "Creating perfect itinerary...",
                            "Searching for flights...",
                            "Checking hotel availability...",
                            "Discovering local attractions...",
                            "Calculating travel budget...",
                            "Finding best routes...",
                            "Checking weather forecasts...",
                            "Curating unique experiences...",
                          ]}
                        />
                        <div
                          className={`"left-0 rounded-tl-full" } absolute top-0 -ml-2 h-4 w-4 border-t border-l border-purple-100 bg-white dark:border-slate-700 dark:bg-slate-800`}
                        />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              <div className="border-t border-purple-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                <div className="px-4 py-4">
                  <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
                </div>
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />
          <ResizablePanel onResize={handleResize} defaultSize={50} className="" minSize={20}>
            {/* {loading && <Loading />} */}
            {
              <Tabs
                value={activeView}
                onValueChange={(value) => setActiveView(value as "overview" | "booking" | "custom")}
                className="flex h-full flex-col"
              >
                {/* <TabsList className="w-full rounded-none border-b">
                <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
                <TabsTrigger value="map" className="flex-1"></TabsTrigger>
                <TabsTrigger value="custom" className="flex-1">Custom</TabsTrigger>
              </TabsList> */}

                <TabsContent value="overview" className="m-0 flex-1 overflow-hidden">
                  <Overview handleChangeView={handleChangeView} handleOpen={() => setOpen(true)} />
                </TabsContent>

                <TabsContent value="booking" className="m-0 flex-1 overflow-hidden">
                  <Booking handleChangeView={handleChangeView} />
                </TabsContent>

                <TabsContent value="custom" className="m-0 flex-1 overflow-hidden">
                  <div className="flex h-full w-full items-center justify-center bg-gray-50">
                    <div className="text-center">
                      <h2 className="mb-2 text-2xl font-bold">Custom Component</h2>
                      <p className="text-gray-600">Thêm component tùy chỉnh của bạn tại đây</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            }
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
      <Sheet open={open} onOpenChange={() => setOpen(false)}>
        <SheetContent className="min-w-[50vw]">
          <SheetHeader>
            <SheetTitle>Select country</SheetTitle>
            <SheetDescription>
              Choose your preferred country for the trip overview.
            </SheetDescription>
          </SheetHeader>
          <SelectCountry />
        </SheetContent>
      </Sheet>
    </div>
  );
}
