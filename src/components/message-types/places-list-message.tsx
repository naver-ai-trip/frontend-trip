/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import { PlaceMessageRes } from "@/types/api";
import { Star } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { Button } from "../ui/button";
import Autoplay from "embla-carousel-autoplay";
import { AddActivityDialog } from "../add-activity-dialog";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreatePlaceDTO, placesService } from "@/services/places-service";
import { toast } from "sonner";
import { ItineraryItemDTO, itineraryItemService } from "@/services/itinerary-item-service";
import { PlaceResult } from "@/app/(main)/trip/[tripId]/page";

interface PlacesListMessageProps {
  components?: PlaceMessageRes[]; // places data
  tripId: number;
  trip: any;
}

export default function PlacesListMessage({
  components = [],
  tripId,
  trip,
}: PlacesListMessageProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [dialogPlace, setDialogPlace] = useState<PlaceMessageRes | null>(null);
  const [selectedDay, setSelectedDay] = useState(1);
  const queryClient = useQueryClient();

  const [draggedPlace, setDraggedPlace] = useState<PlaceResult | null>(null);

  const handleOpenNaver = (link: string) => {
    if (link) {
      window.open(link, "_blank");
    }
  };
  const createPlace = useMutation({
    mutationFn: async (placeData: CreatePlaceDTO) => {
      const response = await placesService.createPlace(placeData);
      return response;
    },
  });

  const {
    data: itineraryItems,
    refetch: refetchItineraryItems,
    isLoading: isLoadingItineraryItems,
  } = useQuery({
    queryKey: ["itinerary-items", Number(tripId), Number(selectedDay)],
    queryFn: async () => {
      const res = await itineraryItemService.getItineraryItems({
        trip_id: Number(tripId),
        day_number: Number(selectedDay),
        page: 1,
        per_page: 100,
      });
      return res;
    },
    enabled: Boolean(tripId) && Number(selectedDay) > 0,
    refetchOnWindowFocus: false,
  });

  const addToItineraryMutation = useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      start_time: string;
      end_time: string;
      place_id: number;
    }) => {
      const toastId = toast.loading("Adding to itinerary...");
      const payload: ItineraryItemDTO = {
        trip_id: Number(tripId),
        day_number: selectedDay,
        ...data,
      };
      await itineraryItemService.addItineraryItem(payload);
      toast.dismiss(toastId);
      return { success: true, data: payload };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["itineraries", tripId] });
      refetchItineraryItems();
      toast.success("Added to itinerary");
    },
    onError: () => {
      toast.dismiss();
      toast.error("Something went wrong! Please try again");
    },
  });

  const handleAddActivity = async (data: {
    title: string;
    description: string;
    start_time: string;
    end_time: string;
    place_id: number;
  }) => {
    const placeDB = await createPlace.mutateAsync({
      name: dialogPlace ? dialogPlace.name : "Unnamed Place",
      latitude: dialogPlace ? dialogPlace.latitude : 0,
      longitude: dialogPlace ? dialogPlace.longitude : 0,
      address: dialogPlace ? dialogPlace.address : "No Address",
      category: dialogPlace ? dialogPlace.category : "Uncategroized",
    });
    const dataWithPlaceId = {
      ...data,
      place_id: placeDB.data.id,
    };
    if (dataWithPlaceId) {
      addToItineraryMutation.mutate(dataWithPlaceId);
    }
    setDialogPlace(null);
    setDraggedPlace(null);
  };

  if (!components || components.length === 0) return null;

  return (
    <div className="w-full">
      <Carousel
        opts={{
          align: "start",
        }}
        plugins={[Autoplay({ playOnInit: true, delay: 2000 })]}
        className=""
      >
        <CarouselContent className="">
          {components.map((place) => (
            <CarouselItem
              key={`${place.longitude}-${place.latitude}`}
              className="min-h-fit w-full snap-start md:basis-1/2 lg:basis-1/3"
            >
              <div className="overflow-hidden rounded-md border">
                <img
                  className="aspect-square w-full object-cover"
                  loading="lazy"
                  src={`https://loremflickr.com/800/600/place?random=${place.latitude}-${place.longitude}-${Date.now()}`}
                />

                <div className="p-2 text-xs">
                  <div className="line-clamp-1 font-semibold">{place.name}</div>

                  <p className="">
                    <span className="mr-1 inline-flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-yellow-500" />
                      {typeof place.rating === "number" ? place.rating.toFixed(1) : place.rating}
                    </span>

                    {/* category chỉ 1 hàng */}
                    <span className="line-clamp-1 block max-w-full truncate capitalize">
                      {place.category}
                    </span>
                  </p>

                  <div className="mt-1 flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenNaver(place.naver_link)}
                    >
                      Naver
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        setDialogPlace(place);
                        setShowAddDialog(true);
                      }}
                    >
                      Add to trip
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <AddActivityDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        dayNumber={selectedDay}
        onSubmit={handleAddActivity}
        setDayNumber={setSelectedDay}
        draggedPlace={dialogPlace}
        existingItineraries={itineraryItems?.data || []}
        trip={trip}
      />
    </div>
  );
}
