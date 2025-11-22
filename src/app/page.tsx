// import { Welcome } from "@/components/welcome";
"use client";

import { ChatNow } from "@/features/home/chat-now";
import { Hot } from "@/features/home/hot";
import { Toolkit } from "@/features/home/toolkit";
import { YourTrip } from "@/features/home/your-trip";
import { PlaceRes, placesService } from "@/services/places-service";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

export default function Home() {
  const { token } = useAuth();

  const places = useQuery<PlaceRes>({
    queryKey: ["places-home"],
    queryFn: async () => {
      const res = await placesService.getPlaces(1, 10);
      return res;
    },
  });

  useEffect(() => {
    // Token is already managed by middleware and useAuth hook
  }, [token]);
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
