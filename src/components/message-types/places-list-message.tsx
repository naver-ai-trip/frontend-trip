"use client";

import { MapPin, Star, Phone, Globe, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Place {
  name: string;
  category: string;
  address: string;
  road_address: string;
  latitude: number;
  longitude: number;
  rating: number;
  phone: string;
  naver_link: string;
  description: string;
  business_hours: string | null;
}

interface PlacesListMessageProps {
  metadata?: Record<string, any>;
}

export default function PlacesListMessage({ metadata }: PlacesListMessageProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!metadata?.places || !Array.isArray(metadata.places)) {
    return null;
  }

  const places: Place[] = metadata.places;

  const handleOpenMap = (lat: number, lng: number) => {
    const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(mapsUrl, "_blank");
  };

  const handleOpenNaver = (link: string) => {
    if (link) {
      window.open(link, "_blank");
    }
  };

  return (
    <div className="w-full space-y-3">
      <div className="mb-4">
        <h3 className="text-foreground text-lg font-semibold">Địa điểm được đề xuất</h3>
        <p className="text-muted-foreground text-sm">
          {places.length} địa điểm phù hợp với sở thích của bạn
        </p>
      </div>

      <div className="max-h-96 space-y-2 overflow-y-auto pr-2">
        {places.map((place, index) => (
          <div
            key={index}
            className="rounded-lg border border-slate-200 bg-white p-3 transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800/50"
          >
            {/* Header with name and rating */}
            <div className="mb-2 flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h4 className="text-foreground truncate font-semibold">{place.name}</h4>
                <p className="text-muted-foreground truncate text-xs">{place.category}</p>
              </div>
              <div className="flex flex-shrink-0 items-center gap-1 rounded bg-yellow-50 px-2 py-1 dark:bg-yellow-900/20">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-300">
                  {place.rating}
                </span>
              </div>
            </div>

            {/* Address */}
            <div className="text-muted-foreground mb-2 flex gap-2 text-xs">
              <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="truncate">{place.address}</p>
                {place.road_address && (
                  <p className="truncate text-slate-500 dark:text-slate-400">
                    {place.road_address}
                  </p>
                )}
              </div>
            </div>

            {/* Expandable details */}
            {expandedIndex === index && (
              <div className="mt-3 space-y-2 border-t border-slate-200 pt-3 dark:border-slate-700">
                {place.phone && (
                  <div className="flex gap-2 text-xs">
                    <Phone className="h-3.5 w-3.5 flex-shrink-0 text-slate-500" />
                    <span className="text-foreground">{place.phone}</span>
                  </div>
                )}

                {place.business_hours && (
                  <div className="flex gap-2 text-xs">
                    <Clock className="h-3.5 w-3.5 flex-shrink-0 text-slate-500" />
                    <span className="text-foreground">{place.business_hours}</span>
                  </div>
                )}

                {place.description && (
                  <p className="text-muted-foreground text-xs">{place.description}</p>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="mt-2 flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                className="h-7 min-w-fit flex-1 text-xs"
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              >
                {expandedIndex === index ? "Ẩn" : "Chi tiết"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-7 min-w-fit flex-1 text-xs"
                onClick={() => handleOpenMap(place.latitude, place.longitude)}
              >
                <MapPin className="mr-1 h-3 w-3" />
                Bản đồ
              </Button>
              {place.naver_link && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 min-w-fit flex-1 text-xs"
                  onClick={() => handleOpenNaver(place.naver_link)}
                >
                  <Globe className="mr-1 h-3 w-3" />
                  Naver
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
