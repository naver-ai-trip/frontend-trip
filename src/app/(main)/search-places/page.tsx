// @next/next/no-img-element
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { ItineraryItemDTO, itineraryItemService } from "@/services/itinerary-item-service";
import { placesService } from "@/services/places-service";
import { tripService } from "@/services/trip-sevice";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  CalendarDays,
  ExternalLink,
  Filter,
  Heart,
  List,
  Loader2,
  Map as MapIcon,
  MapPin,
  Plus,
  Search,
  Star,
} from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Map, { Marker } from "react-map-gl/mapbox";
import { toast } from "sonner";

interface PlaceResult {
  id: number;
  name: string;
  category: string;
  address: string;
  road_address: string;
  latitude: number;
  longitude: number;
  naver_link: string;
  average_rating: number | null;
  review_count: number;
  created_at: string;
  updated_at: string;
}

const CATEGORIES = [
  { value: "all", label: "All Places" },
  { value: "restaurant", label: "Restaurants" },
  { value: "hotel", label: "Hotels" },
  { value: "cafe", label: "Cafes" },
  { value: "tourist", label: "Tourist Attractions" },
  { value: "shopping", label: "Shopping" },
];

// Random landscape images from Unsplash
const LANDSCAPE_IMAGES = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1501436513145-30f24e19fcc4?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1418065460487-3d7063dfd332?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1461988320302-91bde64fc8e4?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop",
];

// Utility functions for consistent random values
const getStableRandomValue = (seed: string | number, min: number, max: number) => {
  const seedStr = seed?.toString();
  let hash = 0;
  for (let i = 0; i < seedStr?.length; i++) {
    const char = seedStr.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  const normalized = Math.abs(hash) / 2147483647; // Max 32bit int
  return Math.floor(normalized * (max - min + 1)) + min;
};

const getPlaceImage = (placeId: number) => {
  const imageIndex = getStableRandomValue(placeId, 0, LANDSCAPE_IMAGES.length - 1);
  return LANDSCAPE_IMAGES[imageIndex];
};

const getPlacePrice = (placeId: number) => {
  return getStableRandomValue(placeId, 60, 100);
};

const getPlaceOriginalPrice = (placeId: number) => {
  const basePrice = getPlacePrice(placeId);
  return getStableRandomValue(`${placeId}-original`, basePrice + 20, basePrice + 70);
};

const getPlaceRating = (placeId: number) => {
  return getStableRandomValue(placeId, 30, 50) / 10; // Rating between 3.0 and 5.0
};

const getPlaceReviewCount = (placeId: number) => {
  return getStableRandomValue(`${placeId}-reviews`, 10, 150);
};

const isGuestFavorite = (placeId: number) => {
  return getStableRandomValue(`${placeId}-favorite`, 0, 10) > 7; // 30% chance
};

const SearchPlace = () => {
  const params = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const initialQuery = params.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"split" | "list" | "map">("split");
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [mapViewport, setMapViewport] = useState({
    longitude: 105.8342,
    latitude: 21.0278, // Default to Hanoi
    zoom: 12,
  });

  // Add to trip modal state
  const [isAddToTripModalOpen, setIsAddToTripModalOpen] = useState(false);
  const [selectedPlaceToAdd, setSelectedPlaceToAdd] = useState<PlaceResult | null>(null);
  const [selectedTripId, setSelectedTripId] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [activityTitle, setActivityTitle] = useState("");
  const [activityDescription, setActivityDescription] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");

  const debouncedQuery = useDebounce(searchQuery, 500);

  // Get user trips for selection
  const { data: trips = [] } = useQuery({
    queryKey: ["trips"],
    queryFn: async () => {
      const response = await tripService.getTrips();
      return response.data || [];
    },
  });

  // Add to trip mutation
  const addToTripMutation = useMutation({
    mutationFn: async (data: {
      place: PlaceResult;
      tripId: string;
      dayNumber: number;
      title: string;
      description: string;
      startTime: string;
      endTime: string;
    }) => {
      // First create the place if it doesn't exist
      const placeId = data.place.id;

      // Create itinerary item
      const payload: ItineraryItemDTO = {
        trip_id: Number(data.tripId),
        title: data.title,
        day_number: data.dayNumber,
        start_time: data.startTime + ":00",
        end_time: data.endTime + ":00",
        place_id: placeId,
        description: data.description,
      };

      return await itineraryItemService.addItineraryItem(payload);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["itinerary-items"] });

      // Show success toast with action button
      toast.success(
        <div className="flex items-center justify-between gap-4">
          <span>Place added to trip successfully!</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              router.push(`/trip/${variables.tripId}`);
              toast.dismiss();
            }}
            className="shrink-0"
          >
            <Calendar className="mr-1 h-3 w-3" />
            View Itinerary
          </Button>
        </div>,
        {
          duration: 5000,
        },
      );

      setIsAddToTripModalOpen(false);
      resetModal();
    },
    onError: () => {
      toast.error("Failed to add place to trip");
    },
  });

  // Search places query
  const {
    data: searchResults = [],
    isLoading,
    error,
    refetch,
  } = useQuery<PlaceResult[]>({
    queryKey: ["searchPlaces", debouncedQuery, selectedCategory],
    queryFn: async () => {
      if (!debouncedQuery.trim()) return [];
      const response = await placesService.searchPlaces(debouncedQuery);
      return response.data || [];
    },
    enabled: !!debouncedQuery.trim(),
  });

  useEffect(() => {
    if (searchResults.length > 0) {
      const firstResult = searchResults[0];
      setMapViewport({
        longitude: firstResult.longitude,
        latitude: firstResult.latitude,
        zoom: 13,
      });
    }
  }, [searchResults]);

  const toggleFavorite = (placeId: string | number) => {
    const newFavorites = new Set(favorites);
    const id = placeId.toString();
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
      toast.success("Removed from favorites");
    } else {
      newFavorites.add(id);
      toast.success("Added to favorites");
    }
    setFavorites(newFavorites);
  };

  const handleAddToTrip = (place: PlaceResult) => {
    setSelectedPlaceToAdd(place);
    setActivityTitle(place.name);
    setActivityDescription(`Visit ${place.name} at ${place.address}`);
    setIsAddToTripModalOpen(true);
  };

  const resetModal = () => {
    setSelectedPlaceToAdd(null);
    setSelectedTripId("");
    setSelectedDay("");
    setActivityTitle("");
    setActivityDescription("");
    setStartTime("09:00");
    setEndTime("17:00");
  };

  const handleSubmitAddToTrip = () => {
    if (
      !selectedPlaceToAdd ||
      !selectedTripId ||
      !selectedDay ||
      !activityTitle ||
      !startTime ||
      !endTime
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (startTime >= endTime) {
      toast.error("End time must be after start time");
      return;
    }

    addToTripMutation.mutate({
      place: selectedPlaceToAdd,
      tripId: selectedTripId,
      dayNumber: Number(selectedDay),
      title: activityTitle,
      description: activityDescription,
      startTime,
      endTime,
    });
  };

  const getDaysForTrip = (tripId: string) => {
    const trip = trips.find((t: any) => t.id.toString() === tripId);
    if (!trip) return [];

    const startDate = new Date(trip.start_date);
    const endDate = new Date(trip.end_date);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    return Array.from({ length: diffDays }, (_, i) => i + 1);
  };

  const handleMarkerClick = (place: PlaceResult) => {
    setSelectedPlace(place);
    setMapViewport({
      longitude: place.longitude,
      latitude: place.latitude,
      zoom: 15,
    });
  };

  const PlaceCard = ({ place }: { place: PlaceResult }) => {
    const isSelected = selectedPlace?.id === place.id;
    const isFavorited = favorites.has(place?.id?.toString());

    return (
      <Card
        className={cn(
          "group cursor-pointer py-0 transition-all hover:shadow-lg",
          isSelected ? "" : "border-border hover:border-primary/50",
        )}
        onClick={() => handleMarkerClick(place)}
      >
        <CardContent className="p-0">
          <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getPlaceImage(place.id)}
              alt={place.name}
              className="h-full w-full object-cover transition-transform hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/10" />
            <Badge
              variant="secondary"
              className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm"
            >
              {place.category}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(place.id);
              }}
            >
              <Heart
                className={cn(
                  "h-4 w-4 transition-colors",
                  isFavorited ? "fill-red-500 text-red-500" : "text-gray-600",
                )}
              />
            </Button>
            {isGuestFavorite(place.id) && (
              <Badge className="absolute top-3 left-20 bg-white text-gray-700">
                Guest favorite
              </Badge>
            )}
          </div>

          <div className="space-y-3 p-4">
            <div className="flex items-start justify-between">
              <h3 className="line-clamp-1 text-lg font-semibold">{place.name}</h3>
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">
                  {place.average_rating
                    ? place.average_rating.toFixed(1)
                    : getPlaceRating(place.id).toFixed(1)}
                </span>
                <span className="text-muted-foreground">
                  ({place.review_count || getPlaceReviewCount(place.id)})
                </span>
              </div>
            </div>

            <div className="flex items-start overflow-hidden text-nowrap text-ellipsis">
              <MapPin className="text-muted-foreground p mt-0.5 h-4 w-4 flex-shrink-0" />
              <p className="text-muted-foreground line-clamp-2 text-sm">{place.address}</p>
            </div>

            <p className="text-muted-foreground line-clamp-2 overflow-hidden text-sm text-nowrap text-ellipsis">
              {place.road_address || place.address}
            </p>

            <div className="flex items-center justify-between border-t pt-2">
              <div className="text-muted-foreground flex items-center gap-1 text-sm">
                <span>{place.review_count ?? 0} reviews</span>
              </div>

              {place.naver_link && (
                <Button variant="ghost" size="sm" asChild>
                  <a href={place.naver_link} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-1 h-3 w-3" />
                    Social
                  </a>
                </Button>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-muted-foreground text-sm line-through">
                  ${getPlaceOriginalPrice(place.id)}
                </span>
                <span className="font-semibold">${getPlacePrice(place.id)} per night</span>
              </div>

              <Button
                variant="default"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToTrip(place);
                }}
                className="flex items-center gap-1"
              >
                <Plus className="h-3 w-3" />
                Add to Trip
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="bg-background flex h-screen flex-col pt-20">
      <div className="flex flex-1 overflow-hidden">
        {(viewMode === "list" || viewMode === "split") && (
          <div
            className={cn(
              "bg-card flex flex-col overflow-hidden border-r",
              viewMode === "split" ? "w-1/2" : "flex-1",
            )}
          >
            <ScrollArea className="h-[300px] flex-1">
              <div className="p-2">
                {isLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                      <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin" />
                      <p className="text-muted-foreground">Searching places...</p>
                    </div>
                  </div>
                ) : error ? (
                  <ErrorState
                    message="Failed to search places"
                    onRetry={() => refetch()}
                  />
                ) : searchResults.length === 0 ? (
                  <div className="py-20 text-center">
                    {debouncedQuery ? (
                      <>
                        <MapPin className="text-muted-foreground/40 mx-auto mb-4 h-16 w-16" />
                        <h3 className="mb-2 font-semibold">No places found</h3>
                        <p className="text-muted-foreground">
                          Try adjusting your search or filters
                        </p>
                      </>
                    ) : (
                      <>
                        <Search className="text-muted-foreground/40 mx-auto mb-4 h-16 w-16" />
                        <h3 className="mb-2 font-semibold">Start exploring</h3>
                        <p className="text-muted-foreground">
                          Search for places, restaurants, or hotels
                        </p>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-6">
                    {searchResults.map((place, index) => (
                      <PlaceCard key={`${place.id}-${index}`} place={place} />
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        )}

        {(viewMode === "map" || viewMode === "split") && (
          <div className={cn("relative", viewMode === "split" ? "w-1/2" : "flex-1")}>
            <Map
              {...mapViewport}
              onMove={(evt) => setMapViewport(evt.viewState)}
              mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
              style={{ width: "100%", height: "100%" }}
              mapStyle="mapbox://styles/mapbox/streets-v11"
            >
              {searchResults.map((place, index) => (
                <Marker
                  key={`marker-${place.id}-${index}`}
                  longitude={place.longitude}
                  latitude={place.latitude}
                  anchor="bottom"
                >
                  <div
                    className="group relative cursor-pointer"
                    onClick={() => handleMarkerClick(place)}
                  >
                    <div
                      className={cn(
                        "relative transition-all duration-200",
                        selectedPlace?.id === place.id ? "scale-110" : "group-hover:scale-105",
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full border-3 border-white text-sm font-bold text-white shadow-lg",
                          selectedPlace?.id === place.id
                            ? "bg-primary"
                            : "hover:bg-primary bg-gray-800",
                        )}
                      >
                        ${getPlacePrice(place.id)}
                      </div>
                    </div>

                    {selectedPlace?.id === place.id && (
                      <div className="absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 transform">
                        <div className="max-w-xs min-w-max rounded-lg border bg-white px-3 py-2 shadow-lg dark:bg-gray-800">
                          <div className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                            {place.name}
                          </div>
                          <div className="truncate text-xs text-gray-600 dark:text-gray-300">
                            {place.category}
                          </div>
                          <div className="mt-1 flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-medium">
                              {place.average_rating
                                ? place.average_rating.toFixed(1)
                                : getPlaceRating(place.id).toFixed(1)}
                            </span>
                          </div>
                          <div className="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 transform border-t-4 border-r-4 border-l-4 border-transparent border-t-white dark:border-t-gray-800"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </Marker>
              ))}
            </Map>
            <div className="absolute top-0 z-10 left-0 right-0 flex flex-col items-center space-y-4 border-b px-6 py-4">
              <div className="flex items-center gap-4">
                <div className="relative w-2xl flex-1">
                  <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                  <Input
                    placeholder="Search for places, restaurants, hotels..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-card"
                  />
                </div>

                {/* <div className="flex items-center rounded-lg border">
                  <Button
                    // variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-r-none"
                  >
                    <List className="mr-1 h-4 w-4" />
                    List
                  </Button>
                  <Button
                    variant={viewMode === "split" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("split")}
                    className="rounded-none border-x"
                  >
                    Split
                  </Button>
                  <Button
                    variant={viewMode === "map" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("map")}
                    className="rounded-l-none"
                  >
                    <MapIcon className="mr-1 h-4 w-4" />
                    Map
                  </Button>
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="mr-1 h-4 w-4" />
                  Filters
                </Button> */}
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {CATEGORIES.map((category) => (
                  <Button
                    key={category.value}
                    variant={selectedCategory === category.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.value)}
                    className="whitespace-nowrap"
                  >
                    {category.label}
                  </Button>
                ))}
              </div>
              {searchResults.length > 0 && (
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground text-sm">
                    Over {searchResults.length} places found for &quot;{debouncedQuery}&quot;
                  </p>
                  <Badge variant="outline">Prices include all fees</Badge>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add to Trip Modal */}
      <Dialog open={isAddToTripModalOpen} onOpenChange={setIsAddToTripModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add to Trip</DialogTitle>
            <DialogDescription>
              Add &quot;{selectedPlaceToAdd?.name}&quot; to your trip itinerary
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Trip Selection */}
            <div className="space-y-2">
              <Label htmlFor="trip">Select Trip</Label>
              <Select value={selectedTripId} onValueChange={setSelectedTripId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a trip" />
                </SelectTrigger>
                <SelectContent>
                  {trips.map((trip: any) => (
                    <SelectItem key={trip.id} value={trip.id.toString()}>
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{trip.title}</div>
                          <div className="text-muted-foreground text-xs">
                            {new Date(trip.start_date).toLocaleDateString()} -{" "}
                            {new Date(trip.end_date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Day Selection */}
            {selectedTripId && (
              <div className="space-y-2">
                <Label htmlFor="day">Select Day</Label>
                <Select value={selectedDay} onValueChange={setSelectedDay}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a day" />
                  </SelectTrigger>
                  <SelectContent>
                    {getDaysForTrip(selectedTripId).map((day) => (
                      <SelectItem key={day} value={day.toString()}>
                        Day {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Activity Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Activity Title</Label>
              <Input
                id="title"
                value={activityTitle}
                onChange={(e) => setActivityTitle(e.target.value)}
                placeholder="Enter activity title"
              />
            </div>

            {/* Activity Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                value={activityDescription}
                onChange={(e) => setActivityDescription(e.target.value)}
                placeholder="Add a description"
              />
            </div>

            {/* Time Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4">
              {selectedTripId && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    router.push(`/trip/${selectedTripId}`);
                  }}
                  className="text-primary"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  View Full Itinerary
                </Button>
              )}

              <div className="ml-auto flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddToTripModalOpen(false);
                    resetModal();
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmitAddToTrip} disabled={addToTripMutation.isPending}>
                  {addToTripMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add to Trip
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

import { Suspense } from "react";
import Error from "next/error";
import { ErrorState } from "@/components/error-state";

export default function SearchPlacesPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <span>Loading...</span>
        </div>
      }
    >
      <SearchPlace />
    </Suspense>
  );
}
