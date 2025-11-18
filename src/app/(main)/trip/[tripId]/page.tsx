"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { use, useEffect, useState, useRef, useCallback } from "react";
import { tripService } from "@/services/trip-sevice";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MapPin,
  Clock,
  Plus,
  MoreHorizontal,
  ArrowUpRightIcon,
  Trash,
  MapPinHouse,
  FileDown,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { AddActivityDialog } from "@/components/add-activity-dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ItineraryItemDTO, itineraryItemService } from "@/services/itinerary-item-service";
import { CreatePlaceDTO, placesService } from "@/services/places-service";
import { useDebounce } from "@/hooks/use-debounce";
import Image from "next/image";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import TripMap from "@/components/trip-map";
import { MapRef } from "react-map-gl/mapbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { exportItineraryToPDF } from "@/utils/export-pdf";

export interface PlaceResult {
  name: string;
  category: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface Trip {
  id: number;
  user_id: number;
  title: string;
  destination_country: string;
  destination_city: string;
  start_date: string;
  end_date: string;
  status: "planning" | "ongoing" | "completed";
  is_group: boolean;
  progress: string;
  duration_days: number | null;
  created_at: string;
  updated_at: string;
}

interface Place {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  category: string;
}

interface Itinerary {
  id?: number;
  trip_id: number;
  title: string;
  day_number: number;
  start_time: string;
  end_time: string;
  place_id: number;
  description: string;
  place?: Place;
}

interface Route {
  start_lat: number;
  start_lng: number;
  goal_lat: number;
  goal_lng: number;
  option: string;
}

const formatTime = (t: string): string => {
  const formatted = t.slice(0, 5);
  return formatted;
};

const MY_BUSAN_LAT_LONG = { latitude: 35.1796, longitude: 129.0756 };

const TripDetail = ({ params }: { params: Promise<{ tripId: string }> }) => {
  const { tripId } = use(params);
  const queryClient = useQueryClient();
  const mapRef = useRef<MapRef>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDay, setSelectedDay] = useState(1);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [draggedPlace, setDraggedPlace] = useState<PlaceResult | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [dialogPlace, setDialogPlace] = useState<PlaceResult | null>(null);
  const [routes, setRoutes] = useState<Route>({
    start_lat: MY_BUSAN_LAT_LONG.latitude,
    start_lng: MY_BUSAN_LAT_LONG.longitude,
    goal_lat: 0,
    goal_lng: 0,
    option: "traoptimal",
  });

  const queryDebounce = useDebounce(searchQuery, 500);

  const { data: trip, isLoading } = useQuery<Trip>({
    queryKey: ["trip", tripId],
    queryFn: async () => {
      const response = await tripService.getTripDetails(tripId);
      return response.data;
    },
  });

  const { data: itineraries = [] } = useQuery<Itinerary[]>({
    queryKey: ["itineraries", tripId],
    queryFn: async () => {
      return [];
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

  // Query to get ALL itinerary items for PDF export (no day_number filter)
  const { data: allItineraryItems } = useQuery({
    queryKey: ["all-itinerary-items", Number(tripId)],
    queryFn: async () => {
      const res = await itineraryItemService.getItineraryItems({
        trip_id: Number(tripId),
        page: 1,
        per_page: 1000, // Get all items
      });
      return res;
    },
    enabled: Boolean(tripId),
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

  const handleSetEndRoute = (lat: number, lng: number) => {
    setRoutes((prev) => ({
      ...prev,
      goal_lat: lat,
      goal_lng: lng,
    }));
  };

  const deleteFromItineraryMutation = useMutation({
    mutationFn: async (itemId: number) => {
      await itineraryItemService.deleteItineraryItem(itemId);
    },
    onSuccess: () => {
      refetchItineraryItems();
      toast.success("Deleted from itinerary");
    },
    onError: () => {
      toast.error("Something went wrong! Please try again");
    },
  });

  const searchPlaces = useMutation({
    mutationFn: async (query: string) => {
      const response = await placesService.searchPlaces(query);
      return response.data ?? [];
    },
  });

  const createPlace = useMutation({
    mutationFn: async (placeData: CreatePlaceDTO) => {
      const response = await placesService.createPlace(placeData);
      return response;
    },
  });

  const getDays = () => {
    if (!trip) return [];
    const startDate = new Date(trip.start_date);
    const endDate = new Date(trip.end_date);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end day

    return Array.from({ length: diffDays }, (_, i) => i + 1);
  };

  const getDateForDay = (dayNumber: number) => {
    if (!trip) return "";

    const startDate = new Date(trip.start_date);
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + (dayNumber - 1));

    // Format: "Nov 13"
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
    return currentDate.toLocaleDateString("en-US", options);
  };

  const getItinerariesByDay = (day: number) => {
    return itineraries.filter((item) => item.day_number === day);
  };

  const handleDragStart = (place: PlaceResult) => {
    setDraggedPlace(place);
  };

  const handleDragEnd = () => {
    setDraggedPlace(null);
  };

  const handleDrop = () => {
    if (draggedPlace) {
      setDialogPlace(draggedPlace);
      setShowAddDialog(true);
    }
  };

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

  const handleAddButtonClick = () => {
    setDialogPlace(null);
    setShowAddDialog(true);
  };

  const handleExportPDF = () => {
    if (!trip) {
      toast.error("Trip data not available");
      return;
    }

    if (!allItineraryItems?.data || allItineraryItems.data.length === 0) {
      toast.error("No itinerary items to export");
      return;
    }

    try {
      exportItineraryToPDF(trip, allItineraryItems.data);
      toast.success("PDF exported successfully!");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Failed to export PDF");
    }
  };

  const fitMapToPlaces = useCallback(() => {
    if (!mapRef.current || !searchPlaces.data || searchPlaces.data.length === 0) return;

    const places = searchPlaces.data as PlaceResult[];

    if (places.length === 1) {
      mapRef.current.flyTo({
        center: [places[0].longitude, places[0].latitude],
        zoom: 14,
        duration: 1500,
      });
    } else {
      const bounds: [[number, number], [number, number]] = places.reduce(
        (acc, place) => {
          return [
            [Math.min(acc[0][0], place.longitude), Math.min(acc[0][1], place.latitude)],
            [Math.max(acc[1][0], place.longitude), Math.max(acc[1][1], place.latitude)],
          ];
        },
        [
          [places[0].longitude, places[0].latitude],
          [places[0].longitude, places[0].latitude],
        ],
      );

      mapRef.current.fitBounds(bounds, {
        padding: 100,
        duration: 1500,
      });
    }
  }, [searchPlaces.data]);

  useEffect(() => {
    if (searchPlaces.data && searchPlaces.data.length > 0) {
      fitMapToPlaces();
    }
  }, [searchPlaces.data, fitMapToPlaces]);

  useEffect(() => {
    if (queryDebounce.trim()) {
      searchPlaces.mutate(queryDebounce);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryDebounce]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto h-12 w-12 animate-spin rounded-full border-b-2"></div>
          <p className="text-muted-foreground mt-4">Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Trip not found</p>
      </div>
    );
  }

  return (
    <div className="bg-background mt-20 flex h-[calc(100vh-96px)] flex-col">
      {/* Header with Export Button */}
      <div className="bg-card flex items-center justify-between border-b px-6 py-3">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl font-bold">{trip.title}</h1>
            <p className="text-muted-foreground text-sm">
              {trip.destination_city}, {trip.destination_country}
            </p>
          </div>
        </div>
        <Button onClick={handleExportPDF} variant="outline" size="sm" className="gap-2">
          <FileDown className="h-4 w-4" />
          Export PDF
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex min-w-1/3 flex-col border-r">
          <div className="bg-card border-b px-4 py-3">
            <div className="relative max-w-2xl">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Search for places, restaurants, or hotels"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          {/* View Toggle */}
          <div className="flex border-b">
            <button
              onClick={() => setViewMode("map")}
              className={cn(
                "flex-1 px-4 py-2.5 text-sm font-medium transition-colors",
                viewMode === "map"
                  ? "text-primary border-primary bg-primary/5 border-b-2"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              )}
            >
              Map View
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "flex-1 px-4 py-2.5 text-sm font-medium transition-colors",
                viewMode === "list"
                  ? "text-primary border-primary bg-primary/5 border-b-2"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              )}
            >
              List View
            </button>
          </div>
          {viewMode === "map" && (
            <div className="relative flex-1">
              <TripMap
                routes={routes}
                ref={mapRef}
                searchResults={searchPlaces?.data || []}
                itineraries={getItinerariesByDay(selectedDay)}
                selectedDay={selectedDay}
                onAddPlace={(place) => {
                  setDialogPlace(place);
                  setShowAddDialog(true);
                }}
                userLocation={MY_BUSAN_LAT_LONG}
              />
              {/* Clear Route Button */}
              {routes.goal_lat && routes.goal_lng && routes.start_lat && routes.start_lng && (
                <div className="absolute top-4 right-4 z-10">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setRoutes({
                        start_lat: MY_BUSAN_LAT_LONG.latitude,
                        start_lng: MY_BUSAN_LAT_LONG.longitude,
                        goal_lat: 0,
                        goal_lng: 0,
                        option: "traoptimal",
                      });
                      toast.success("Route cleared");
                    }}
                    className="shadow-lg"
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Clear Route
                  </Button>
                </div>
              )}
            </div>
          )}

          <div className="bg-card border-t">
            <div className="border-b px-4 py-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">UNSCHEDULED</h3>
              </div>
            </div>
            <div
              className={cn(
                "space-y-2 overflow-y-auto p-2",
                viewMode === "list" ? "h-full" : "max-h-48",
              )}
            >
              {searchPlaces?.data?.map((place: PlaceResult) => (
                <div
                  key={place.latitude}
                  draggable
                  onDragStart={() => handleDragStart(place)}
                  onDragEnd={handleDragEnd}
                  className="group bg-background hover:bg-muted/50 relative cursor-move rounded-lg border transition-all hover:shadow-md"
                >
                  <div className="flex gap-3 p-3">
                    <div className="from-primary/20 to-primary/5 h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-gradient-to-br">
                      <Image
                        className="aspect-square object-cover"
                        src={"https://mycayseouly.vn/Images/image/mycay/Kimbap.jpg"}
                        width={48}
                        height={48}
                        alt="place"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-sm font-medium">{place.name}</h4>
                      <p className="text-muted-foreground truncate text-xs">{place.address}</p>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDialogPlace(place);
                        setShowAddDialog(true);
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {!searchPlaces?.data ||
                (searchPlaces?.data?.length === 0 && (
                  <Empty className="h-full">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <Search className="text-muted-foreground h-12 w-12" />
                      </EmptyMedia>
                      <EmptyTitle>No places found yet</EmptyTitle>
                      <EmptyDescription>
                        You haven&apos;t created any projects yet. Get started by creating your
                        first project.
                      </EmptyDescription>
                    </EmptyHeader>
                    <Button variant="link" asChild className="text-muted-foreground" size="sm">
                      <a href="#">
                        Learn More <ArrowUpRightIcon />
                      </a>
                    </Button>
                  </Empty>
                ))}
              {!searchPlaces?.data &&
                (addToItineraryMutation.isPending || searchPlaces.isPending) && (
                  <div className="py-6 text-center">
                    <div className="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-b-2"></div>
                    <p className="text-muted-foreground mt-4 text-sm">Searching places...</p>
                  </div>
                )}
            </div>
          </div>
        </div>

        <div className="bg-muted/20 flex max-w-2/3 flex-1 flex-col">
          <ScrollArea className="flex w-full flex-nowrap whitespace-nowrap">
            {getDays().map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={cn(
                  "border-b-2 px-6 py-3 text-sm font-medium whitespace-nowrap transition-all",
                  selectedDay === day
                    ? "text-primary border-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border-transparent",
                )}
              >
                Day {day}: {getDateForDay(day)}
              </button>
            ))}
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="mx-auto max-w-3xl space-y-6">
              {itineraryItems?.data?.length > 0 &&
                itineraryItems?.data?.map((item: any) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-24 flex-shrink-0 pt-1">
                      <div className="flex items-center gap-1.5 text-sm">
                        <Clock className="text-primary h-4 w-4" />
                        <span className="font-medium">{formatTime(item.start_time)}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <Card className="py-1 transition-shadow hover:shadow-md">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="from-primary/20 to-primary/5 h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br">
                              <div className="flex h-full w-full items-center justify-center">
                                <MapPin className="text-primary/60 h-6 w-6" />
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="mb-1 text-base font-semibold">{item.title}</h3>
                              <p className="text-muted-foreground mb-2 text-sm">
                                {item?.place?.address}
                              </p>
                              <Badge variant="secondary" className="text-xs">
                                {formatTime(item.start_time)} - {formatTime(item.end_time)}
                              </Badge>
                            </div>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-40 p-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-full justify-start"
                                  onClick={() => deleteFromItineraryMutation.mutate(item.id)}
                                >
                                  <Trash className="mr-2 h-4 w-4 text-red-600" />
                                  Delete
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-full justify-start"
                                  onClick={() =>
                                    handleSetEndRoute(item.place.latitude, item.place.longitude)
                                  }
                                >
                                  <MapPinHouse className="mr-2 h-4 w-4 text-red-600" />
                                  Distant Home
                                </Button>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ))}
              {itineraryItems?.data?.length === 0 && !isLoadingItineraryItems && (
                <div
                  className="border-muted-foreground/20 rounded-lg border-2 border-dashed p-12 text-center"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleDrop();
                  }}
                >
                  <div className="space-y-3">
                    <div className="bg-muted/50 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
                      <MapPin className="text-muted-foreground/40 h-8 w-8" />
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1 font-medium">Drag a location here</p>
                      <p className="text-muted-foreground/60 text-sm">or</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleAddButtonClick}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Activity
                    </Button>
                  </div>
                </div>
              )}

              {itineraryItems?.data?.length > 0 && (
                <div
                  className="border-muted-foreground/10 hover:border-primary/30 hover:bg-primary/5 cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleDrop();
                  }}
                  onClick={handleAddButtonClick}
                >
                  <Plus className="text-muted-foreground/40 mx-auto mb-2 h-5 w-5" />
                  <p className="text-muted-foreground text-sm">Add another activity</p>
                </div>
              )}

              {isLoadingItineraryItems && (
                <div className="py-6 text-center">
                  <div className="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-b-2"></div>
                  <p className="text-muted-foreground mt-4 text-sm">Loading itinerary...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AddActivityDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        dayNumber={selectedDay}
        onSubmit={handleAddActivity}
        draggedPlace={dialogPlace}
        existingItineraries={itineraryItems?.data || []}
      />
    </div>
  );
};

export default TripDetail;
