"use client";

import ChatInput from "@/components/chat-input";
import ChatMessage from "@/components/chat-message";
import TextMessage from "@/components/message-types/text-message";
import { TextMessageAgentLoading } from "@/components/message-types/text-message-agent-loading";
import ModernLoader from "@/components/ui/modern-loader";
// import StreamStateDisplay from "@/components/stream-state-display";

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
import { useChatComponent } from "@/hooks/use-chat-component";
import { parseSSEStream } from "@/lib/utils";
import { chatSessionService, MessageStreamRequest } from "@/services/chat-session-service";
import { tripService } from "@/services/trip-sevice";
import { MessageRequest, MessageResponse } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Bot } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { MapRef } from "react-map-gl/mapbox";
import { toast } from "sonner";

export default function ChatPage() {
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState<"overview" | "booking" | "custom">("overview");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapRef | null>(null);
  const params = useSearchParams();
  const router = useRouter();
  // remember last consumed prefilled message to avoid double-send
  const consumedPrefilledRef = useRef<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [tripId, setTripId] = useState<string | null>(null);
  const [firstMessage, setFirstMessage] = useState<string | null>("Hello agent");
  const [streamStates, setStreamStates] = useState<
    Array<{ type: "progress" | "response" | "complete" | "error"; node?: string; data?: any }>
  >([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentProgressNode, setCurrentProgressNode] = useState<string | null>(null);
  const {
    components,
    next_suggestions,
    type,
    setComponents,
    setCurrentPlanning,
    setType,
    setNextSuggestions,
    reset,
  } = useChatComponent();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = useMutation({
    mutationFn: async ({ sessionId, content }: { sessionId: string; content: MessageRequest }) => {
      const res = await chatSessionService.sendMessage(sessionId, content);
      return res;
    },
  });

  const sendStreamMessage = useMutation({
    mutationFn: async (req: MessageStreamRequest) => {
      const stream = await chatSessionService.streamMessage(req);
      setIsStreaming(true);
      await parseSSEStream({
        stream: stream,

        onProgress: (node) => {
          setStreamStates((prev) => [...prev, { type: "progress", node }]);
          setCurrentProgressNode(node);
        },

        onResponse: (data) => {
          setStreamStates((prev) => [...prev, { type: "response", data }]);

          if (data) {
            setNextSuggestions(data.next_suggestions);
            console.log(data.components);

            if (data.components && data.components.length > 0) {
              if (
                data.components[0].type === "trip_planning" ||
                data.components[0].data.type === "places_list"
              ) {
                setComponents(data.components[0].data.places);
                setType(data.components[0].data.type);
                setCurrentPlanning(data.components[0].data.places);
              }
            }
          }
          setMessages((prev) => {
            if (prev.length === 0) {
              return [
                {
                  id: Date.now(),
                  chat_session_id: req.session_id,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                  metadata: data.next_suggestions
                    ? ({ next_suggestions: data.next_suggestions } as any)
                    : null,
                  references: null,
                  from_role: "assistant",
                  message_type: "text",
                  content: data || "",
                },
              ];
            }

            const newMessages = [...prev];
            const last = newMessages[newMessages.length - 1];
            if (last.from_role === "assistant") {
              newMessages[newMessages.length - 1] = {
                ...last,
                content: data,
                metadata: data.next_suggestions
                  ? ({ ...last.metadata, next_suggestions: data.next_suggestions } as any)
                  : last.metadata,
                updated_at: new Date().toISOString(),
                references: data.references,
                message_type: data.message_type,
                chat_session_id: req.session_id,
              };
            }
            return newMessages;
          });
        },
        onComplete: () => {
          setStreamStates((prev) => [...prev, { type: "complete" }]);
        },
      });
    },
    onError: (error) => {
      console.error("Stream mutation error:", error);
      setIsStreaming(false);
    },
    onSuccess: () => {
      setIsStreaming(false);
    },
  });

  console.log(messages);

  const getMessages = useQuery({
    queryKey: ["messages", sessionId],
    queryFn: async () => {
      if (!sessionId) return [];
      const { data } = await chatSessionService.getMessages(sessionId);
      if (data) {
        setMessages(data);
        const tripPlanning = [...data]
          .reverse()
          .find((i: any) => i.content.includes("trip_planning"));
        if (tripPlanning) {
          const tripPlanningParsed = JSON.parse(tripPlanning.content);
          setCurrentPlanning(tripPlanningParsed.components[0].data.places);
        }
        return data;
      }
    },
    enabled: !!sessionId,
  });

  const getTripDetail = useQuery({
    queryKey: ["trip", tripId],
    queryFn: async () => {
      if (!tripId) return null;
      const { data } = await tripService.getTripDetails(tripId);
      return data;
    },
    enabled: !!tripId,
  });

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!content?.trim()) return;
      setIsLoading(true);
      try {
        const currentSessionId = params.get("sessionId");
        const currentTripId = params.get("tripId");
        if (!currentSessionId || !currentTripId) {
          console.error("No session id");
          setIsLoading(false);
          return;
        }

        const streamMessageReq: MessageStreamRequest = {
          message: content,
          session_id: Number(currentSessionId),
          auth_token: `${localStorage.getItem("token") || "1|XhXYyGossrCNGHdB60vuLWPYwSbSO1RRcYHVFaAXd5a178cb"}`,
          trip_id: Number(currentTripId),
        };

        const messageUserDB = await sendMessage.mutateAsync({
          sessionId: currentSessionId,
          content: {
            from_role: "user",
            message_type: "text",
            content,
          },
        });

        if (!messageUserDB || !messageUserDB.data) {
          toast.error("Failed to send message");
          setIsLoading(false);
          return;
        }

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            chat_session_id: Number(currentSessionId),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            metadata: null,
            references: null,
            from_role: "user",
            message_type: "text",
            content: content,
          },
        ]);

        const agentMessageId = Date.now() + 1;
        setMessages((prev) => [
          ...prev,
          {
            id: agentMessageId,
            chat_session_id: Number(currentSessionId),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            metadata: null,
            references: null,
            from_role: "assistant",
            message_type: "text",
            content: "",
          },
        ]);

        await sendStreamMessage.mutateAsync(streamMessageReq);
        setIsLoading(false);
      } catch (error) {
        console.log("Error calling API:", error);
        const errorMessage: MessageResponse = {
          id: Date.now(),
          chat_session_id: Number(params.get("sessionId")) || 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          metadata: null,
          references: null,
          from_role: "assistant",
          message_type: "text",
          content: "Sorry, there was an error connecting to the server. Please try again.",
        };
        setMessages((prev) => [...prev, errorMessage]);
        setIsLoading(false);
      }
    },
    [params, sendMessage, sendStreamMessage],
  );

  useEffect(() => {
    const prefilledMessage = params.get("message");
    const sessionId = params.get("sessionId");
    const tripId = params.get("tripId");
    setFirstMessage(prefilledMessage);
    setSessionId(sessionId);
    setTripId(tripId);
    if (prefilledMessage && consumedPrefilledRef.current !== prefilledMessage) {
      consumedPrefilledRef.current = prefilledMessage;
      handleSendMessage(prefilledMessage);
      try {
        const url = `/chat?sessionId=${sessionId}&tripId=${tripId}`;
        router.replace(url);
      } catch {
        // ignore
      }
    }
  }, [params, handleSendMessage, router]);

  // Reset chat component store when leaving Chat page (unmount)
  useEffect(() => {
    return () => {
      try {
        reset();
      } catch (e) {
        console.error("Failed to reset chat store on unmount", e);
      }
    };
  }, [reset]);

  const handleResize = () => {
    if (mapRef.current) {
      mapRef.current.resize();
    }
  };

  const handleChangeView = (view: "overview" | "booking" | "custom") => {
    setActiveView(view);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
    setNextSuggestions([]);
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
                  {messages.map((message: MessageResponse) => (
                    <ChatMessage
                      tripId={Number(tripId)}
                      key={message.id}
                      message={message}
                      trip={getTripDetail.data}
                    />
                  ))}
                  {isStreaming && (
                    // currentProgressNode
                    <div className={`flex gap-3 ${"justify-start"} group`}>
                      <div className="mt-1 flex-shrink-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg ring-2 ring-purple-200 dark:ring-slate-700">
                          <Bot className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className={`flex max-w-2xl flex-col items-start`}>
                        <div
                          className={`text-foreground ,a relative max-w-[100%] rounded-3xl rounded-tl-md border border-purple-100 bg-white px-4 py-2 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800`}
                        >
                          <ModernLoader
                            words={[
                              "Setting things up...",
                              "Initializing modules...",
                              "Almost ready...",
                            ]}
                            currentProgressNode={currentProgressNode}
                          />
                          <div
                            className={`absolute top-0 left-0 -ml-2 h-4 w-4 rounded-tl-full border-t border-l border-purple-100 bg-white dark:border-slate-700 dark:bg-slate-800`}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              <div className="border-t border-purple-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                {next_suggestions && (
                  <div className="flex flex-wrap pt-2">
                    {next_suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="mx-2 mb-2 inline-flex cursor-pointer items-center gap-2 rounded-full px-2 py-2 text-[12px] shadow-sm transition hover:bg-white/90 dark:bg-slate-800/80 dark:hover:bg-slate-700/90"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
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
                  <Overview
                    handleChangeView={handleChangeView}
                    handleOpen={() => setOpen(true)}
                    trip={getTripDetail.data}
                  />
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
