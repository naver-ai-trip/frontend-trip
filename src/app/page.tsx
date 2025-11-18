// import { Welcome } from "@/components/welcome";
'use client';

import { ChatNow } from "@/features/home/chat-now";
import { Hot } from "@/features/home/hot";
import { Toolkit } from "@/features/home/toolkit";
import { YourTrip } from "@/features/home/your-trip";
import { PlaceRes, placesService } from "@/services/places-service";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const places = useQuery<PlaceRes>({
    queryKey: ['places-home'],
    queryFn: async () => {
      const res = await placesService.getPlaces(1, 10);
      return res;
    }
  });
  return (
    <>
      <ChatNow />
      <div className="container mt-8 mx-auto  max-w-6xl">
        <YourTrip />
        <Hot places={places.data?.data} />
        <Toolkit />
      </div>
    </>
  );
}
