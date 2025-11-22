"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TimePicker } from "@/components/ui/time-picker";
import { MapPin } from "lucide-react";
import { PlaceResult } from "@/app/(main)/trip/[tripId]/page";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface ItineraryItem {
  id: number;
  start_time: string;
  end_time: string;
  title: string;
}

interface AddActivityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dayNumber: number;
  onSubmit: (data: {
    title: string;
    description: string;
    start_time: string;
    end_time: string;
    place_id: number;
  }) => void;
  draggedPlace?: PlaceResult | null;
  existingItineraries?: ItineraryItem[];
  setDayNumber?: (day: number) => void;
  trip?: any;
}

export function AddActivityDialog({
  open,
  onOpenChange,
  dayNumber,
  onSubmit,
  draggedPlace,
  existingItineraries = [],
  setDayNumber,
  trip,
}: AddActivityDialogProps) {
  const [title, setTitle] = useState(draggedPlace?.name || "");
  const [description, setDescription] = useState(draggedPlace?.address || "");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("11:00");
  const [timeError, setTimeError] = useState("");

  React.useEffect(() => {
    if (open) {
      if (draggedPlace) {
        setTitle(draggedPlace.name);
        setDescription(draggedPlace.address);
      } else {
        setTitle("");
        setDescription("");
      }
      setStartTime("09:00");
      setEndTime("11:00");
    }
  }, [open, draggedPlace]);

  const checkTimeOverlap = (newStart: string, newEnd: string): string | null => {
    const newStartMinutes = timeToMinutes(newStart);
    const newEndMinutes = timeToMinutes(newEnd);

    for (const item of existingItineraries) {
      const existingStart = timeToMinutes(item.start_time.substring(0, 5));
      const existingEnd = timeToMinutes(item.end_time.substring(0, 5));

      // Check if times overlap
      if (
        (newStartMinutes >= existingStart && newStartMinutes < existingEnd) ||
        (newEndMinutes > existingStart && newEndMinutes <= existingEnd) ||
        (newStartMinutes <= existingStart && newEndMinutes >= existingEnd)
      ) {
        return `Time conflicts with "${item.title}" (${item.start_time.substring(0, 5)} - ${item.end_time.substring(0, 5)})`;
      }
    }
    return null;
  };

  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeError("");

    if (startTime >= endTime) {
      setTimeError("End time must be after start time");
      return;
    }

    const overlap = checkTimeOverlap(startTime, endTime);
    if (overlap) {
      setTimeError(overlap);
      return;
    }

    onSubmit({
      title,
      description,
      start_time: startTime + ":00",
      end_time: endTime + ":00",
      place_id: 0,
    });

    setTitle("");
    setDescription("");
    setStartTime("09:00");
    setEndTime("11:00");
    setTimeError("");
    onOpenChange(false);
  };

  const getDays = () => {
    if (!trip) return [];
    const startDate = new Date(trip.start_date);
    const endDate = new Date(trip.end_date);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end day

    return Array.from({ length: diffDays }, (_, i) => i + 1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Activity - Day {dayNumber}</DialogTitle>
          <DialogDescription>
            Schedule a new activity for your trip. Set the time and add details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Selected Place Info */}
            {draggedPlace && (
              <div className="bg-muted flex items-center gap-3 rounded-lg border p-3">
                <div className="bg-primary/10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md">
                  <MapPin className="text-primary h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{draggedPlace.name}</p>
                  <p className="text-muted-foreground truncate text-xs">{draggedPlace.category}</p>
                </div>
              </div>
            )}

            {setDayNumber && trip && (
              <div className="space-y-2">
                <Label htmlFor="day">Select Day</Label>
                <Select
                  value={dayNumber.toString()}
                  onValueChange={(value) => setDayNumber(Number(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a day" />
                  </SelectTrigger>
                  <SelectContent>
                    {getDays().map((day) => (
                      <SelectItem key={day} value={day.toString()}>
                        Day {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Activity Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Visit Tokyo Tower"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add details about this activity..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <TimePicker label="Start Time" value={startTime} onChange={setStartTime} />
              <TimePicker label="End Time" value={endTime} onChange={setEndTime} />
            </div>

            <div className="text-muted-foreground text-center text-sm">
              Duration: {calculateDuration(startTime, endTime)}
            </div>

            {/* Time Error Message */}
            {timeError && (
              <div className="text-destructive bg-destructive/10 border-destructive/20 rounded-md border p-3 text-sm">
                <p className="font-medium">⚠️ {timeError}</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setTimeError("");
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Add Activity</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function calculateDuration(start: string, end: string): string {
  const [startHour, startMin] = start.split(":").map(Number);
  const [endHour, endMin] = end.split(":").map(Number);

  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  const diffMinutes = endMinutes - startMinutes;

  if (diffMinutes < 0) return "Invalid";

  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  if (hours === 0) return `${minutes} minutes`;
  if (minutes === 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
  return `${hours} hour${hours > 1 ? "s" : ""} ${minutes} min`;
}
