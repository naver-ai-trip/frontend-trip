"use client";

import { TripFormData } from "@/app/(main)/create-trip/page";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { chatSessionService, CreateSessionRequest } from "@/services/chat-session-service";
import { tripService } from "@/services/trip-sevice";
import { useMutation } from "@tanstack/react-query";
import { Paperclip, Plus, Send, TrendingUp, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
const suggestions = [
  "5-day Seoul itinerary",
  "Best places to visit in Busan",
  "3-day Jeju trip",
  "Budget Korea trip plan",
  "Hidden gems in Korea",
];

export const ChatNow = () => {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useRouter();
  const [open, setOpen] = useState(false);
  const [newCity, setNewCity] = useState("");

  const [formData, setFormData] = useState<TripFormData>({
    country: "",
    startDate: "",
    endDate: "",
    cities: [],
  });
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [input]);

  const onOpen = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const calculateDays = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      return days > 0 ? days : 0;
    }
    return 0;
  };

  const handleAddCity = () => {
    if (newCity.trim() && !formData.cities.includes(newCity.trim())) {
      setFormData((prev) => ({
        ...prev,
        cities: [...prev.cities, newCity.trim()],
      }));
      setNewCity("");
    }
  };

  const handleRemoveCity = (cityToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      cities: prev.cities.filter((city) => city !== cityToRemove),
    }));
  };

  const createChatSession = useMutation({
    mutationFn: async (data: CreateSessionRequest) => {
      return await chatSessionService.createSession(data);
    },
  });

  const {
    mutateAsync: createTripAsync,
    isPending,
    data: newTrip,
    isSuccess: isTripCreated,
  } = useMutation({
    mutationFn: async () => {
      return await tripService.createTrip({
        title: `Trip to ${formData.country}`,
        destination_country: formData.country,
        destination_city: formData.cities[0] || formData.country,
        start_date: formData.startDate,
        end_date: formData.endDate,
        status: "planning",
        is_group: false,
        progress: `Planning to visit: ${formData.cities.join(", ")}`,
      });
    },
    onSuccess: () => {
      toast.success("Trip created successfully!");
    },
    onError: () => {
      toast.error("Failed to create trip");
    },
  });

  const handleSubmit = () => {
    onOpen();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleClickSend = async () => {
    try {
      const trip = await createTripAsync();
      if (!trip) {
        toast.error("Failed to create trip");
        return;
      }

      const chatSession = await createChatSession.mutateAsync({
        context: {
          budget: "moderate",
          interests: [],
          destination: trip.destination_country,
          travel_dates: {
            start: trip.start_date,
            end: trip.end_date,
          },
        },
        session_type: "trip_planning",
        trip_id: trip.data.id,
      });
      if (!chatSession.data) {
        toast.error("Failed to create chat session");
        return;
      }
      const url = `/chat?tripId=${trip.data.id}&sessionId=${chatSession.data?.id}&message=${encodeURIComponent(input)}`;
      debugger;
      navigate.push(url);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      onClose();
    }
  };

  return (
    <section className="bg-background relative flex min-h-screen w-full flex-col items-center">
      {/* Overlay để làm tối video và chữ nổi bật hơn */}
      <div className="absolute inset-0 z-[1] bg-black/40"></div>

      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full bg-black object-cover object-center"
      >
        <source src="/homepage-bg-video_1.mp4" type="video/mp4" />
      </video>
      <div className="relative z-10">
        <div className="flex flex-col items-center justify-center px-4 py-32 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] [text-shadow:_2px_2px_4px_rgb(0_0_0_/_80%)] sm:text-5xl lg:text-6xl">
            Experience our AI travel assistant
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] [text-shadow:_1px_1px_3px_rgb(0_0_0_/_80%)]">
            Custom trip plans, destination recommendations, and instant travel planning support.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="relative min-w-3xl flex-1 overflow-hidden rounded-xl border bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900/80">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              // disabled={isLoading}
              rows={2}
              className="scrollbar-thin scrollbar-thumb-purple-300 dark:scrollbar-thumb-slate-600 max-h-32 w-full resize-none overflow-y-auto px-4 py-3 placeholder-slate-500 focus:outline-none dark:text-white dark:placeholder-slate-400"
              style={{ minHeight: "44px" }}
            />

            {/* Character count */}
            {input.length > 0 && (
              <div className="absolute top-1 right-2 text-xs text-slate-400">
                {input.length}/2000
              </div>
            )}
            <div className="m-2 flex justify-between">
              <Button variant="secondary" className="text-sm">
                <Paperclip />
                Attach
              </Button>
              <div>
                <Button onClick={handleSubmit} className="" variant="secondary">
                  <Send />
                  Plan my trip
                </Button>
              </div>
            </div>
          </div>
          <div className="z-50 mt-4 flex w-full max-w-5xl flex-wrap items-center justify-start overflow-x-auto px-4">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setInput(suggestion)}
                className="m-2 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm shadow-md transition hover:bg-white/90 dark:bg-slate-800/80 dark:hover:bg-slate-700/90"
              >
                <TrendingUp className="size-5" /> {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Trip</DialogTitle>
            <p className="text-muted-foreground text-sm">Let&apos;s create a new trip</p>
          </DialogHeader>
          <form className="space-y-3">
            <div className="">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  placeholder="Enter destination country..."
                  value={formData.country}
                  onChange={(e) => setFormData((prev) => ({ ...prev, country: e.target.value }))}
                  className="h-11"
                  autoFocus
                />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Popular destinations</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {["Thailand", "Vietnam", "Korea", "USA"].map((country) => (
                    <Button
                      key={country}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setFormData((prev) => ({ ...prev, country }))}
                      className={formData.country === country ? "border-primary bg-primary/5" : ""}
                    >
                      {country}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, startDate: e.target.value }))
                    }
                    className="h-11"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                    className="h-11"
                    min={formData.startDate || new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>

              {formData.startDate && formData.endDate && calculateDays() > 0 && (
                <div className="bg-muted/50 rounded-lg border p-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">Trip Duration</span>
                    <span className="text-lg font-semibold">
                      {calculateDays()} {calculateDays() === 1 ? "day" : "days"}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="city">Add Cities</Label>
                <div className="flex gap-2">
                  <Input
                    id="city"
                    placeholder="Enter city name..."
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCity();
                      }
                    }}
                    className="h-11 flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleAddCity}
                    size="lg"
                    disabled={!newCity.trim()}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add
                  </Button>
                </div>
              </div>

              {formData.cities.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-muted-foreground text-sm">
                    Selected Cities ({formData.cities.length})
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {formData.cities.map((city, index) => (
                      <div
                        key={index}
                        className="bg-muted flex items-center gap-2 rounded-md border px-3 py-1.5"
                      >
                        <span className="text-sm font-medium">{city}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCity(city)}
                          className="hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {formData.country && (
                <div>
                  <p className="text-muted-foreground mb-2 text-sm">
                    Popular cities in {formData.country}
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {formData.country.toLowerCase() === "thailand" &&
                      ["Bangkok", "Phuket", "Chiang Mai", "Pattaya", "Krabi", "Ayutthaya"].map(
                        (city) => (
                          <Button
                            key={city}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (!formData.cities.includes(city)) {
                                setFormData((prev) => ({
                                  ...prev,
                                  cities: [...prev.cities, city],
                                }));
                              }
                            }}
                            disabled={formData.cities?.includes(city)}
                          >
                            {city}
                          </Button>
                        ),
                      )}

                    {formData.country.toLowerCase() === "vietnam" &&
                      ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Hội An", "Huế", "Nha Trang"].map(
                        (city) => (
                          <Button
                            key={city}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (!formData.cities.includes(city)) {
                                setFormData((prev) => ({
                                  ...prev,
                                  cities: [...prev.cities, city],
                                }));
                              }
                            }}
                            disabled={formData.cities.includes(city)}
                          >
                            {city}
                          </Button>
                        ),
                      )}

                    {formData.country.toLowerCase() === "korea" &&
                      ["Seoul", "Busan", "Jeju", "Daegu", "Incheon", "Gwangju"].map((city) => (
                        <Button
                          key={city}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (!formData.cities.includes(city)) {
                              setFormData((prev) => ({
                                ...prev,
                                cities: [...prev.cities, city],
                              }));
                            }
                          }}
                          disabled={formData.cities.includes(city)}
                        >
                          {city}
                        </Button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </form>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleClickSend}
              disabled={
                !(
                  formData.country &&
                  formData.startDate &&
                  formData.endDate &&
                  formData.cities.length > 0
                )
              }
            >
              {isPending || createChatSession.isPending ? (
                <span className="flex items-center gap-2">
                  <Spinner className="size-4" />
                  Creating...
                </span>
              ) : (
                "Create Trip"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};
