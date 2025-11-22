import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Building2, Car, FerrisWheel, MapPinHouse, Plane, Utensils } from "lucide-react";
import Image from "next/image";
import React from "react";
import type { PlaceMessageRes } from "@/types/api";
import { useChatComponent } from "@/hooks/use-chat-component";

interface TimelineItem {
  id: string;
  type: "flight" | "transfer" | "city" | "accommodation" | "restaurant" | "attraction";
  title: string;
  description?: string;
  image?: string;
  details?: {
    duration?: string;
    route?: string;
    price?: string;
    rating?: number;
    reviewCount?: number;
    address?: string;
  };
}

interface DaySchedule {
  date: string;
  title: string;
  items: TimelineItem[];
}

export const toDaySchedule = (places: PlaceMessageRes[]): DaySchedule[] => {
  if (!Array.isArray(places) || places.length === 0) return [];

  const group: Record<number, TimelineItem[]> = {};

  const toMinutes = (t?: string) => {
    if (!t) return Number.MAX_SAFE_INTEGER;
    const [hh, mm] = t.split(":").map(Number);
    return (hh ?? 0) * 60 + (mm ?? 0);
  };

  places.forEach((p, idx) => {
    const day = (p as any).day ?? 1;
    const type: TimelineItem["type"] =
      p.activity_type === "restaurant" ? "restaurant" : "attraction";

    const item: TimelineItem = {
      id: `${idx}-${p.name}`,
      type,
      title: p.name,
      description: p.description || p.category,
      image: undefined,
      details: {
        address: p.road_address || p.address,
        rating: p.rating,
      },
    };

    if (!group[day]) group[day] = [];
    group[day].push(item);
  });

  const days = Object.keys(group)
    .map((d) => Number(d))
    .sort((a, b) => a - b);

  return days.map((day) => {
    const items = group[day].slice().sort((a, b) => {
      const pa = (
        places.find(
          (p) => (p as any).day === day && p.name === group[day][group[day].indexOf(a)]?.title,
        ) as any
      )?.start_time;
      const pb = (
        places.find(
          (p) => (p as any).day === day && p.name === group[day][group[day].indexOf(b)]?.title,
        ) as any
      )?.start_time;
      return toMinutes(pa) - toMinutes(pb);
    });

    return {
      date: `Day ${day}`,
      title: `Activities for day ${day}`,
      items,
    };
  });
};

interface TripTimeLineProps {
  handleChangeView?: (view: "overview" | "booking" | "custom") => void;
  useRealData?: boolean;
}

export const TripTimeLine = ({ handleChangeView, useRealData = true }: TripTimeLineProps) => {
  const { currentPlanning } = useChatComponent();
  const realData = currentPlanning ? toDaySchedule(currentPlanning as PlaceMessageRes[]) : [];
  const data = useRealData ? realData : [];

  return (
    <div className="trip-timeline w-full space-y-4">
      <Accordion type="multiple" className="w-full" defaultValue={["item-0"]}>
        {data.map((day, dayIndex) => (
          <AccordionItem
            key={dayIndex}
            value={`item-${dayIndex}`}
            className="mb-4 rounded-lg border"
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-3 text-left">
                <span className="font-semibold text-blue-600">{day.date}</span>
                <span className="text-gray-700">{day.title}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="mt-2 space-y-4">
                {day.items.map((item, itemIndex) => (
                  <div
                    key={item.id}
                    className="flex gap-4"
                    onClick={() => handleChangeView && handleChangeView("booking")}
                  >
                    <div className="flex flex-col items-center">
                      <div className="bg-primary flex min-h-10 w-10 items-center justify-center rounded-full text-xl text-white">
                        {getIconForType(item.type)}
                      </div>
                      {itemIndex < day.items.length - 1 && (
                        <div className="my-2 h-full min-h-[60px] w-0.5 bg-gray-300" />
                      )}
                    </div>
                    <Card className="flex-1 p-2">
                      <div className="flex items-start gap-3">
                        {item.image && (
                          <Image
                            width={100}
                            height={100}
                            src={item.image}
                            alt={item.title}
                            className="aspect-square rounded object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{item.title}</h3>
                          {item.description && (
                            <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                          )}

                          {item.details && (
                            <div className="mt-2 space-y-1 text-sm text-gray-700">
                              {item.details.duration && (
                                <p className="flex items-center gap-2">
                                  <span>⏱️</span>
                                  <span>{item.details.duration}</span>
                                  {item.details.route && (
                                    <span className="ml-2">• {item.details.route}</span>
                                  )}
                                </p>
                              )}
                              {item.details.price && (
                                <p className="font-medium text-blue-600">{item.details.price}</p>
                              )}
                              {item.details.rating && (
                                <p className="flex items-center gap-1">
                                  <span>⭐</span>
                                  <span>{item.details.rating}</span>
                                  {item.details.reviewCount && (
                                    <span className="text-gray-500">
                                      ({item.details.reviewCount.toLocaleString()} reviews)
                                    </span>
                                  )}
                                </p>
                              )}
                              {item.details.address && (
                                <p className="text-gray-600">📍 {item.details.address}</p>
                              )}
                            </div>
                          )}
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">⋯</button>
                      </div>
                    </Card>
                  </div>
                ))}

                {dayIndex === 0 && (
                  <button className="ml-14 rounded-lg px-4 py-2 text-blue-600 transition-colors hover:bg-blue-50">
                    + Add
                  </button>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
        {data.length === 0 && <div className="text-center text-gray-500">No data available</div>}
      </Accordion>
    </div>
  );
};

const getIconForType = (type: TimelineItem["type"]) => {
  const icons = {
    flight: <Plane className="size-5" />,
    transfer: <Car className="size-5" />,
    city: <Building2 className="size-5" />,
    accommodation: <MapPinHouse className="size-5" />,
    restaurant: <Utensils className="size-5" />,
    attraction: <FerrisWheel className="size-5" />,
  };
  return icons[type] || "📍";
};
