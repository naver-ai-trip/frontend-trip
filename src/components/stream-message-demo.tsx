"use client";

import ChatMessage from "@/components/chat-message";
import { Button } from "@/components/ui/button";
import { Message } from "@/types";
import { Play, RotateCcw } from "lucide-react";
import { useState } from "react";

/**
 * Demo component to test stream message functionality
 * Uses mock data from mock-stream-message.json
 */
export default function StreamMessageDemo() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const mockStreamMessage: Message = {
    id: "mock-1",
    role: "agent",
    type: "places_list",
    content:
      "I found 5 amazing places in Seoul that match your preferences! These include top-rated restaurants, cultural attractions, and hotels in the heart of the city.",
    metadata: {
      places: [
        {
          name: "롯데호텔서울 도림",
          category: "중식>중식당",
          address: "서울특별시 중구 소공동 1 메인타워 37F",
          road_address: "서울특별시 중구 을지로 30 메인타워 37F",
          latitude: 37.5652853,
          longitude: 126.9808087,
          rating: 4.5,
          phone: "",
          naver_link: "https://www.lottehotel.com/seoul-hotel/ko/dining/restaurant-toh-lim",
          description: "",
          business_hours: null,
        },
        {
          name: "서울시티투어버스",
          category: "버스>투어버스",
          address: "서울특별시 중구 태평로1가 62-9",
          road_address: "서울특별시 중구 세종대로 135-7",
          latitude: 37.5688156,
          longitude: 126.9767218,
          rating: 4.5,
          phone: "",
          naver_link: "https://www.instagram.com/seoultigerbus_official/",
          description: "",
          business_hours: null,
        },
        {
          name: "롯데호텔서울 무궁화",
          category: "한식>한정식",
          address: "서울특별시 중구 소공동 1 롯데호텔서울 본관 38층",
          road_address: "서울특별시 중구 을지로 30 롯데호텔서울 본관 38층",
          latitude: 37.5654272,
          longitude: 126.9816208,
          rating: 4.5,
          phone: "",
          naver_link: "https://www.lottehotel.com/seoul-hotel/ko/dining/restaurant-mugunghwa",
          description: "",
          business_hours: null,
        },
        {
          name: "국립현대미술관 서울",
          category: "문화,예술>미술관",
          address: "서울특별시 종로구 소격동 165",
          road_address: "서울특별시 종로구 삼청로 30",
          latitude: 37.5787817,
          longitude: 126.9800492,
          rating: 4.5,
          phone: "",
          naver_link: "http://www.mmca.go.kr/",
          description: "",
          business_hours: null,
        },
        {
          name: "프레지던트 호텔",
          category: "숙박>호텔",
          address: "서울특별시 중구 을지로1가 188-3 프레지던트호텔",
          road_address: "서울특별시 중구 을지로 16 프레지던트호텔",
          latitude: 37.5657665,
          longitude: 126.9795531,
          rating: 4.5,
          phone: "",
          naver_link: "http://www.hotelpresident.co.kr/",
          description: "",
          business_hours: null,
        },
      ],
      actions_taken: ["Searched places in Seoul", "Found 5 locations matching your criteria"],
      next_suggestions: ["Add a place to itinerary", "Get directions", "Search nearby attractions"],
    },
    timestamp: new Date(),
  };

  const handleStreamMessage = async () => {
    setIsStreaming(true);
    setMessages([]);

    // Simulate streaming by adding message after a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setMessages([mockStreamMessage]);
    setIsStreaming(false);
  };

  const handleReset = () => {
    setMessages([]);
    setIsStreaming(false);
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex gap-2">
        <Button onClick={handleStreamMessage} disabled={isStreaming} className="flex gap-2">
          <Play className="h-4 w-4" />
          Stream Message Demo
        </Button>
        <Button onClick={handleReset} variant="outline" className="flex gap-2">
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>

      <div className="min-h-96 space-y-4 rounded-lg border bg-slate-50 p-4 dark:bg-slate-900">
        {messages.length === 0 ? (
          <div className="text-muted-foreground flex h-96 items-center justify-center">
            <p>Click to see the stream message in action</p>
          </div>
        ) : (
          messages.map((message) => <ChatMessage key={message.id} message={message} />)
        )}
      </div>
    </div>
  );
}
