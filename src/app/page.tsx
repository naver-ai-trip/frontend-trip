// import { Welcome } from "@/components/welcome";
"use client";

import { ChatNow } from "@/features/home/chat-now";
import { Hot } from "@/features/home/hot";
import { Toolkit } from "@/features/home/toolkit";
import { YourTrip } from "@/features/home/your-trip";
import { PlaceRes, placesService } from "@/services/places-service";
import { useQuery } from "@tanstack/react-query";
import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const params = useSearchParams();

  const places = useQuery<PlaceRes>({
    queryKey: ["places-home"],
    queryFn: async () => {
      const res = await placesService.getPlaces(1, 10);
      return res;
    },
  });

  useEffect(() => {
    if (params.get("token")) {
      localStorage.setItem("token", params.get("token") || "");
    }
  }, [params]);

  return (
    <>
      <ChatNow />
      <div className="container mx-auto mt-8 max-w-6xl">
        <YourTrip />
        <Hot places={places.data?.data} />
        <Toolkit />
      </div>
    </>
  );
}
