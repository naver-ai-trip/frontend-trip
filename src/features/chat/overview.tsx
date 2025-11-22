import React from "react";
import { NameTrip } from "./components/name-trip";
import { TripGallery } from "./components/trip-galary";
import { TripMap } from "./components/trip-map";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toDaySchedule, TripTimeLine } from "./components/trip-time-line";
import { Button } from "@/components/ui/button";
import { useChatComponent } from "@/hooks/use-chat-component";
import { useMutation } from "@tanstack/react-query";
import { CreatePlaceDTO, placesService } from "@/services/places-service";
import { toast } from "sonner";
import { ItineraryItemDTO, itineraryItemService } from "@/services/itinerary-item-service";
import { PlaceMessageRes } from "@/types/api";
import { Plus } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

interface OverviewProps {
  handleOpen: () => void;
  handleChangeView?: (view: "overview" | "booking" | "custom") => void;
  trip?: any;
}

export const Overview = ({ handleOpen, handleChangeView, trip }: OverviewProps) => {
  const { currentPlanning } = useChatComponent();
  const data = toDaySchedule(currentPlanning as PlaceMessageRes[]);
  const [isCreating, setIsCreating] = React.useState(false);
  const addToItineraryMutation = useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      start_time: string;
      end_time: string;
      place_id: number;
      day: number;
    }) => {
      const payload: ItineraryItemDTO = {
        trip_id: Number(trip.id),
        day_number: data.day,
        ...data,
      };
      await itineraryItemService.addItineraryItem(payload);
      return { success: true, data: payload };
    },
    onSuccess: () => {},
    onError: () => {
      toast.dismiss();
    },
  });

  const createPlace = useMutation({
    mutationFn: async (placeData: CreatePlaceDTO) => {
      const response = await placesService.createPlace(placeData);
      return response;
    },
  });

  const handleCreateNewItinerary = async () => {
    try {
      if (!currentPlanning || currentPlanning.length === 0) {
        toast.error("No places to create itinerary");
        return;
      }
      setIsCreating(true);
      const toastId = toast.loading("Creating itinerary...");
      for (const place of currentPlanning) {
        const placeDB = await createPlace.mutateAsync({
          name: place.name,
          latitude: place.latitude,
          longitude: place.longitude,
          address: place.address,
          category: place.category,
        });
        const dataWithPlaceId: {
          title: string;
          description: string;
          start_time: string;
          end_time: string;
          place_id: number;
          day: number;
        } = {
          title: place.name,
          description: place.description,
          start_time: place.start_time + ":00",
          end_time: place.end_time + ":00",
          place_id: placeDB.data.id,
          day: place.day,
        };
        await addToItineraryMutation.mutateAsync(dataWithPlaceId);
      }

      toast.success("Itinerary created successfully!", {
        id: toastId,
      });
    } catch (error) {
      console.log(error);
      setIsCreating(false);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <ScrollArea className="flex h-screen flex-col gap-8 overflow-y-scroll p-4">
      <div className="grid h-[40vh] grid-cols-5 gap-4 overflow-hidden">
        <div className="col-span-3 flex flex-col gap-4">
          <div className="flex-1">
            <NameTrip tripName={trip?.title || "Unnamed Trip"} handleOpen={handleOpen} />
          </div>
          <div className="flex-1">{/* <TripGallery /> */}</div>
        </div>
        <div className="col-span-2">
          <TripMap />
        </div>
      </div>
      <div className="py-10">
        <div className="flex justify-between">
          <div className="mb-2 pb-1 text-2xl">Trip Timeline</div>
          <Button onClick={handleCreateNewItinerary}>
            {isCreating ? <Spinner className="size-4" /> : <Plus className="h-4 w-4" />}
            {isCreating ? "Creating..." : "Create new itinerary"}
          </Button>
        </div>
        <TripTimeLine handleChangeView={handleChangeView} />
      </div>
    </ScrollArea>
  );
};
