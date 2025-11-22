"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { tripService } from "@/services/trip-sevice";
import { useMutation } from "@tanstack/react-query";
import { Calendar, MapPin, ArrowRight, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export interface TripFormData {
  country: string;
  startDate: string;
  endDate: string;
  cities: string[];
}

export default function CreateTripPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<TripFormData>({
    country: "",
    startDate: "",
    endDate: "",
    cities: [],
  });
  const [newCity, setNewCity] = useState("");

  const { mutate: createTrip, isPending } = useMutation({
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
      router.push("/trip");
    },
    onError: () => {
      toast.error("Failed to create trip");
    },
  });

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

  const handleNext = () => {
    if (currentStep === 1 && !formData.country) {
      toast.error("Please enter a country");
      return;
    }
    if (currentStep === 2 && (!formData.startDate || !formData.endDate)) {
      toast.error("Please select start and end dates");
      return;
    }
    if (currentStep === 3 && formData.cities.length === 0) {
      toast.error("Please add at least one city");
      return;
    }

    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    createTrip();
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

  return (
    <div className="min-h-screen bg-gray-50 px-4 pt-24 pb-12 dark:bg-gray-950">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-10">
          <div className="mb-2 flex items-center gap-3">
            {/* <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-lg">
              <Plane className="w-6 h-6 text-primary-foreground" />
            </div> */}
            <h1 className="text-foreground text-3xl font-bold">Create New Trip</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Plan your next adventure in a few simple steps
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="relative flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="relative z-10 flex flex-1 flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-medium transition-all ${
                    currentStep === step
                      ? "bg-primary border-primary text-primary-foreground"
                      : currentStep > step
                        ? "bg-primary border-primary text-primary-foreground"
                        : "bg-background border-border text-muted-foreground"
                  }`}
                >
                  {currentStep > step ? "✓" : step}
                </div>
                <span
                  className={`mt-2 text-xs font-medium ${
                    currentStep >= step ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {step === 1 ? "Destination" : step === 2 ? "Dates" : "Cities"}
                </span>
              </div>
            ))}
            <div className="bg-border absolute top-5 right-0 left-0 -z-0 h-0.5" />
            <div
              className="bg-primary absolute top-5 left-0 -z-0 h-0.5 transition-all duration-300"
              style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Card */}
        <Card className="border shadow-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-semibold">
              {currentStep === 1 && "Where do you want to go?"}
              {currentStep === 2 && "When are you traveling?"}
              {currentStep === 3 && "Which cities to explore?"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Choose your destination country"}
              {currentStep === 2 && "Select your travel dates"}
              {currentStep === 3 && "Add the cities you want to visit"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Country */}
            {currentStep === 1 && (
              <div className="space-y-6">
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
                  <p className="text-muted-foreground mb-3 text-sm">Popular destinations</p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {[
                      "Japan",
                      "Thailand",
                      "France",
                      "Italy",
                      "Spain",
                      "Vietnam",
                      "Korea",
                      "USA",
                    ].map((country) => (
                      <Button
                        key={country}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setFormData((prev) => ({ ...prev, country }))}
                        className={
                          formData.country === country ? "border-primary bg-primary/5" : ""
                        }
                      >
                        {country}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Dates */}
            {currentStep === 2 && (
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
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, endDate: e.target.value }))
                      }
                      className="h-11"
                      min={formData.startDate || new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>

                {formData.startDate && formData.endDate && calculateDays() > 0 && (
                  <div className="bg-muted/50 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">Trip Duration</span>
                      <span className="text-lg font-semibold">
                        {calculateDays()} {calculateDays() === 1 ? "day" : "days"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Cities */}
            {currentStep === 3 && (
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
                      size="default"
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
                    <p className="text-muted-foreground mb-3 text-sm">
                      Popular cities in {formData.country}
                    </p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {formData.country.toLowerCase() === "japan" &&
                        ["Tokyo", "Kyoto", "Osaka", "Hiroshima", "Sapporo", "Fukuoka"].map(
                          (city) => (
                            <Button
                              key={city}
                              type="button"
                              variant="outline"
                              size="lg"
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
                      {formData.country.toLowerCase() === "thailand" &&
                        ["Bangkok", "Phuket", "Chiang Mai", "Pattaya", "Krabi", "Ayutthaya"].map(
                          (city) => (
                            <Button
                              key={city}
                              type="button"
                              variant="outline"
                              size="lg"
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
                      {formData.country.toLowerCase() === "france" &&
                        ["Paris", "Lyon", "Marseille", "Nice", "Bordeaux", "Strasbourg"].map(
                          (city) => (
                            <Button
                              key={city}
                              type="button"
                              variant="outline"
                              size="lg"
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
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Summary Preview */}
            {currentStep === 3 && formData.cities.length > 0 && (
              <div className="bg-muted/30 rounded-lg border p-5">
                <h3 className="mb-4 font-semibold">Trip Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <MapPin className="text-muted-foreground h-4 w-4 flex-shrink-0" />
                    <div>
                      <span className="text-muted-foreground">Destination: </span>
                      <span className="font-medium">{formData.country}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="text-muted-foreground h-4 w-4 flex-shrink-0" />
                    <div>
                      <span className="text-muted-foreground">Duration: </span>
                      <span className="font-medium">
                        {new Date(formData.startDate).toLocaleDateString()} -{" "}
                        {new Date(formData.endDate).toLocaleDateString()}
                      </span>
                      <span className="text-muted-foreground ml-1">({calculateDays()} days)</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0" />
                    <div>
                      <span className="text-muted-foreground">Cities: </span>
                      <span className="font-medium">{formData.cities.join(", ")}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 border-t pt-6">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1"
                  disabled={isPending}
                >
                  Back
                </Button>
              )}
              <Button
                type="button"
                onClick={handleNext}
                className={currentStep === 1 ? "w-full" : "flex-1"}
                disabled={isPending}
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Creating...
                  </span>
                ) : (
                  <>
                    {currentStep < 3 ? "Continue" : "Create Trip"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
