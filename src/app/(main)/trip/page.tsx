"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Plus,
  MapPin,
  Calendar,
  Users,
  Clock,
  Pencil,
  Trash2,
  Eye,
  MoreVertical,
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { tripService } from "@/services/trip-sevice";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface Trip {
  id: string;
  title: string;
  destination_country: string;
  destination_city: string;
  start_date: string;
  end_date: string;
  status: "planning" | "ongoing" | "completed";
  is_group: boolean;
  progress: string;
}

const STATUS_COLORS = {
  planning: "bg-blue-100 text-blue-700 border-blue-200",
  ongoing: "bg-green-100 text-green-700 border-green-200",
  completed: "bg-gray-100 text-gray-700 border-gray-200",
};

export default function TripManagementPage() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    destination_country: "",
    destination_city: "",
    start_date: "",
    end_date: "",
    status: "planning" as Trip["status"],
    is_group: false,
    progress: "",
  });

  const { mutate: createTrip, isPending: isCreating } = useMutation({
    mutationFn: async () => {
      if (
        formData.title.trim() === "" ||
        formData.destination_country.trim() === "" ||
        formData.destination_city.trim() === "" ||
        formData.start_date.trim() === "" ||
        formData.end_date.trim() === ""
      ) {
        throw new Error("Please fill in all required fields.");
      }
      const { data } = await tripService.createTrip({
        title: formData.title,
        destination_country: formData.destination_country,
        destination_city: formData.destination_city,
        start_date: formData.start_date,
        end_date: formData.end_date,
        status: formData.status,
        is_group: formData.is_group,
        progress: formData.progress,
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Trip created successfully!");
      setOpen(false);
      setFormData({
        title: "",
        destination_country: "",
        destination_city: "",
        start_date: "",
        end_date: "",
        status: "planning",
        is_group: false,
        progress: "",
      });
      setEditingTrip(null);
      refetch();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create trip.");
      console.error("Error creating trip:", error);
    },
  });

  const {
    data: trips,
    refetch,
    isLoading: isLoadingTrips,
  } = useQuery({
    queryKey: ["trips"],
    queryFn: async () => {
      const data = await tripService.getTrips();
      return data?.data || [];
    },
  });

  const { mutate: deleteTrip, isPending: isDeleting } = useMutation({
    mutationFn: async (tripId: string) => {
      await tripService.deleteTrip(tripId);
    },
    onSuccess: () => {
      toast.success("Trip deleted successfully!");
      refetch();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete trip.");
      console.error("Error deleting trip:", error);
    },
  });

  const { mutate: updateTrip, isPending: isUpdating } = useMutation({
    mutationFn: async (data: Partial<Trip> & { id: string }) => {
      const { id, ...updateData } = data;
      const updatedTrip = await tripService.updateTrip(id, updateData);
      return updatedTrip;
    },
    onSuccess: () => {
      toast.success("Trip updated successfully!");
      setOpen(false);
      setEditingTrip(null);
      setFormData({
        title: "",
        destination_country: "",
        destination_city: "",
        start_date: "",
        end_date: "",
        status: "planning",
        is_group: false,
        progress: "",
      });
      refetch();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update trip.");
      console.error("Error updating trip:", error);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingTrip) {
      // Update existing trip
      const toastId = toast.loading("Updating trip...");
      try {
        await updateTrip({
          id: editingTrip.id,
          ...formData,
        });
        toast.dismiss(toastId);
      } catch {
        toast.dismiss(toastId);
      }
    } else {
      // Create new trip
      const toastId = toast.loading("Creating trip...");
      try {
        await createTrip();
        toast.dismiss(toastId);
      } catch {
        toast.dismiss(toastId);
      }
    }
  };

  const handleEditTrip = (trip: Trip) => {
    setEditingTrip(trip);
    setFormData({
      title: trip.title,
      destination_country: trip.destination_country,
      destination_city: trip.destination_city,
      start_date: trip.start_date,
      end_date: trip.end_date,
      status: trip.status,
      is_group: trip.is_group,
      progress: trip.progress,
    });
    setOpen(true);
  };

  const handleDeleteTrip = async (tripId: string, tripTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${tripTitle}"?`)) {
      return;
    }

    const toastId = toast.loading("Deleting trip...");
    try {
      await deleteTrip(tripId);
      toast.dismiss(toastId);
    } catch {
      toast.dismiss(toastId);
    }
  };

  const handleCloseSheet = () => {
    setOpen(false);
    setEditingTrip(null);
    setFormData({
      title: "",
      destination_country: "",
      destination_city: "",
      start_date: "",
      end_date: "",
      status: "planning",
      is_group: false,
      progress: "",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 pt-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Trips</h1>
            <p className="mt-1 text-gray-600">Plan and manage your travel adventures</p>
          </div>

          <Sheet
            open={open}
            onOpenChange={(isOpen) => {
              setOpen(isOpen);
              if (!isOpen) {
                handleCloseSheet();
              }
            }}
          >
            {/* <SheetTrigger asChild> */}
            <Link href={"/create-trip"}>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Trip
              </Button>
            </Link>
            {/* </SheetTrigger> */}
            <SheetContent className="w-full overflow-y-auto px-4 sm:max-w-2xl">
              <SheetHeader>
                <SheetTitle>{editingTrip ? "Edit Trip" : "Create New Trip"}</SheetTitle>
                <SheetDescription>
                  {editingTrip
                    ? "Update your trip details"
                    : "Fill in the details for your upcoming adventure"}
                </SheetDescription>
              </SheetHeader>

              <form onSubmit={handleSubmit} className="flex h-full flex-col justify-between pb-4">
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Trip Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="e.g., Tokyo Adventure"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="destination_country">Country *</Label>
                      <Input
                        id="destination_country"
                        name="destination_country"
                        placeholder="e.g., Japan"
                        value={formData.destination_country}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="destination_city">City *</Label>
                      <Input
                        id="destination_city"
                        name="destination_city"
                        placeholder="e.g., Tokyo"
                        value={formData.destination_city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start_date">Start Date *</Label>
                      <Input
                        id="start_date"
                        name="start_date"
                        type="date"
                        value={formData.start_date}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="end_date">End Date *</Label>
                      <Input
                        id="end_date"
                        name="end_date"
                        type="date"
                        value={formData.end_date}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="progress">Progress/Notes</Label>
                    <Input
                      id="progress"
                      name="progress"
                      placeholder="e.g., Planning itinerary"
                      value={formData.progress}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_group"
                      name="is_group"
                      checked={formData.is_group}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="is_group" className="cursor-pointer">
                      Group Trip
                    </Label>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    size={"lg"}
                    variant="outline"
                    onClick={handleCloseSheet}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size={"lg"}
                    className="flex-1"
                    disabled={isCreating || isUpdating}
                  >
                    {isCreating || isUpdating ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin">⏳</span>
                        {editingTrip ? "Updating..." : "Creating..."}
                      </span>
                    ) : editingTrip ? (
                      "Update Trip"
                    ) : (
                      "Create Trip"
                    )}
                  </Button>
                </div>
              </form>
            </SheetContent>
          </Sheet>
        </div>

        {/* Trips Grid */}
        {isLoadingTrips ? (
          <div className="py-12 text-center">
            <div className="mb-4 animate-spin text-4xl">⏳</div>
            <p className="text-gray-600">Loading your trips...</p>
          </div>
        ) : trips?.length === 0 ? (
          <div className="py-12 text-center">
            <MapPin className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">No trips yet</h3>
            <p className="mb-4 text-gray-600">Start planning your next adventure!</p>
            <Button onClick={() => setOpen(true)}>Create Your First Trip</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trips?.map((trip: any) => (
              <Card key={trip.id} className="cursor-pointer transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="mb-2 text-xl">{trip.title}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {trip.destination_city}, {trip.destination_country}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`rounded-full border px-2 py-1 text-xs ${STATUS_COLORS[trip.status as "planning" | "ongoing" | "completed"]}`}
                    >
                      {trip.status}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{calculateDuration(trip.start_date, trip.end_date)} days</span>
                  </div>

                  {trip.is_group && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>Group Trip</span>
                    </div>
                  )}

                  {trip.progress && (
                    <div className="border-t pt-2">
                      <p className="text-sm text-gray-600 italic">{trip.progress}</p>
                    </div>
                  )}

                  <div className="flex gap-2 border-t pt-3">
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1"
                      onClick={() => router.push(`/trip/${trip.id}`)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="px-3" disabled={isDeleting}>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditTrip(trip)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit Trip
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteTrip(trip.id, trip.title)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Trip
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
