"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Clock,
  MapPin,
  Hotel,
  UtensilsCrossed,
  Landmark,
  Star,
  MoreVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Favorite {
  id: number;
  user_id: number;
  favoritable_type: string;
  favoritable_id: number;
  created_at: string;
  updated_at: string;
  favoritable?: {
    id: number;
    name: string;
    address?: string;
    rating?: number;
    image_url?: string;
    category?: string;
    price?: string;
  };
}

const FAVORITE_TYPES = [
  { value: "all", label: "All Items", icon: Heart },
  { value: "Place", label: "Places", icon: Landmark },
  { value: "Hotel", label: "Hotels", icon: Hotel },
  { value: "Restaurant", label: "Restaurants", icon: UtensilsCrossed },
  { value: "recently_viewed", label: "Recently Viewed", icon: Clock },
];

const WishlistsPage = () => {
  const [selectedType, setSelectedType] = useState("all");

  // Mock data - replace with actual API call
  const { data: favorites = [], isLoading } = useQuery<Favorite[]>({
    queryKey: ["favorites", selectedType],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return [
        {
          id: 1,
          user_id: 1,
          favoritable_type: "Place",
          favoritable_id: 5,
          created_at: "2025-11-12T12:18:30.738Z",
          updated_at: "2025-11-12T12:18:30.738Z",
          favoritable: {
            id: 5,
            name: "Eiffel Tower",
            address: "Paris, France",
            rating: 4.8,
            image_url: "",
            category: "Landmark",
          },
        },
        {
          id: 2,
          user_id: 1,
          favoritable_type: "Hotel",
          favoritable_id: 10,
          created_at: "2025-11-11T10:00:00.738Z",
          updated_at: "2025-11-11T10:00:00.738Z",
          favoritable: {
            id: 10,
            name: "Amazing pools 2023",
            address: "Bali, Indonesia",
            rating: 4.9,
            image_url: "",
            category: "Hotel",
            price: "$250/night",
          },
        },
        {
          id: 3,
          user_id: 1,
          favoritable_type: "Restaurant",
          favoritable_id: 15,
          created_at: "2025-11-10T15:30:00.738Z",
          updated_at: "2025-11-10T15:30:00.738Z",
          favoritable: {
            id: 15,
            name: "Lẩu dại 2024",
            address: "Hanoi, Vietnam",
            rating: 4.7,
            image_url: "",
            category: "Restaurant",
            price: "$$",
          },
        },
      ];
    },
  });

  const getTypeIcon = (type: string) => {
    const found = FAVORITE_TYPES.find((t) => t.value === type);
    return found?.icon || Heart;
  };

  const filteredFavorites =
    selectedType === "all"
      ? favorites
      : favorites.filter((f) => f.favoritable_type === selectedType);

  const getCategoryColor = (type: string) => {
    switch (type) {
      case "Place":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
      case "Hotel":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400";
      case "Restaurant":
        return "bg-orange-500/10 text-orange-600 dark:text-orange-400";
      default:
        return "bg-gray-500/10 text-gray-600 dark:text-gray-400";
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto h-12 w-12 animate-spin rounded-full border-b-2"></div>
          <p className="text-muted-foreground mt-4">Loading wishlists...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pt-20">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">Wishlists</h1>
          <p className="text-muted-foreground">
            Save your favorite places, hotels, and restaurants for your next trip
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="scrollbar-hide mb-8 flex gap-3 overflow-x-auto pb-4">
          {FAVORITE_TYPES.map((type) => {
            const Icon = type.icon;
            const count =
              type.value === "all"
                ? favorites.length
                : favorites.filter((f) => f.favoritable_type === type.value).length;

            return (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={cn(
                  "flex items-center gap-2 rounded-lg border-2 px-4 py-2.5 font-medium whitespace-nowrap transition-all",
                  selectedType === type.value
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-card hover:bg-muted border-border",
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{type.label}</span>
                {count > 0 && (
                  <Badge
                    variant={selectedType === type.value ? "secondary" : "outline"}
                    className="ml-1"
                  >
                    {count}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>

        {/* Wishlists Grid */}
        {filteredFavorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-muted mb-4 flex h-24 w-24 items-center justify-center rounded-full">
              <Heart className="text-muted-foreground h-12 w-12" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">No favorites yet</h3>
            <p className="text-muted-foreground max-w-md text-center">
              Start adding places, hotels, and restaurants to your wishlist to see them here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredFavorites.map((favorite) => {
              const Icon = getTypeIcon(favorite.favoritable_type);
              const item = favorite.favoritable;

              return (
                <Card
                  key={favorite.id}
                  className="group cursor-pointer overflow-hidden py-0 transition-all hover:shadow-lg"
                >
                  {/* Image */}
                  <div className="from-primary/20 to-primary/5 relative aspect-[4/3] overflow-hidden bg-gradient-to-br">
                    {item?.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Icon className="text-primary/40 h-16 w-16" />
                      </div>
                    )}

                    {/* Heart Button */}
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute top-3 right-3 h-9 w-9 rounded-full shadow-md transition-transform hover:scale-110"
                    >
                      <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                    </Button>

                    {/* Category Badge */}
                    <Badge
                      className={cn(
                        "absolute bottom-3 left-3",
                        getCategoryColor(favorite.favoritable_type),
                      )}
                    >
                      {item?.category || "Item"}
                    </Badge>
                  </div>

                  {/* Content */}
                  <CardContent className="p-4">
                    <div className="mb-2 flex items-start justify-between">
                      <h3 className="line-clamp-1 flex-1 text-lg font-semibold">
                        {item?.name || "Untitled"}
                      </h3>
                      <Button variant="ghost" size="icon" className="-mr-2 h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>

                    {item?.address && (
                      <div className="text-muted-foreground mb-2 flex items-center gap-1.5 text-sm">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="line-clamp-1">{item.address}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      {item?.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{item.rating}</span>
                        </div>
                      )}

                      {item?.price && (
                        <span className="text-primary text-sm font-medium">{item.price}</span>
                      )}
                    </div>

                    {/* Saved date */}
                    <div className="text-muted-foreground mt-3 border-t pt-3 text-xs">
                      Saved{" "}
                      {new Date(favorite.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Summary Stats */}
        {filteredFavorites.length > 0 && (
          <div className="text-muted-foreground mt-8 text-center text-sm">
            Showing {filteredFavorites.length} {filteredFavorites.length === 1 ? "item" : "items"}
            {selectedType !== "all" && " in this category"}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistsPage;
