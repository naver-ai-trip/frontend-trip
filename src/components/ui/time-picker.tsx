"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp, Clock } from "lucide-react";
import * as React from "react";

interface TimePickerProps {
  value: string; // Format: "HH:MM"
  onChange: (time: string) => void;
  label?: string;
}

export function TimePicker({ value, onChange, label }: TimePickerProps) {
  const [hours, minutes] = value.split(":");

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let h = parseInt(e.target.value) || 0;
    h = Math.max(0, Math.min(23, h));
    onChange(`${h.toString().padStart(2, "0")}:${minutes}`);
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let m = parseInt(e.target.value) || 0;
    m = Math.max(0, Math.min(59, m));
    onChange(`${hours}:${m.toString().padStart(2, "0")}`);
  };

  const incrementHours = () => {
    let h = parseInt(hours) || 0;
    h = (h + 1) % 24;
    onChange(`${h.toString().padStart(2, "0")}:${minutes}`);
  };

  const decrementHours = () => {
    let h = parseInt(hours) || 0;
    h = (h - 1 + 24) % 24;
    onChange(`${h.toString().padStart(2, "0")}:${minutes}`);
  };

  const incrementMinutes = () => {
    let m = parseInt(minutes) || 0;
    m = (m + 15) % 60;
    onChange(`${hours}:${m.toString().padStart(2, "0")}`);
  };

  const decrementMinutes = () => {
    let m = parseInt(minutes) || 0;
    m = (m - 15 + 60) % 60;
    onChange(`${hours}:${m.toString().padStart(2, "0")}`);
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="flex items-center gap-2">
        <Clock className="text-muted-foreground h-4 w-4" />
        <div className="flex items-center gap-1">
          <div className="flex flex-col items-center">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={incrementHours}
            >
              <ChevronUp />
            </Button>
            <Input
              type="number"
              min="0"
              max="23"
              value={hours}
              onChange={handleHoursChange}
              className="h-10 w-20 text-center text-lg font-semibold"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={decrementHours}
            >
              <ChevronDown />
            </Button>
          </div>

          <span className="text-2xl font-bold">:</span>

          {/* Minutes */}
          <div className="flex flex-col items-center">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={incrementMinutes}
            >
              <ChevronUp />
            </Button>
            <Input
              type="number"
              min="0"
              max="59"
              value={minutes}
              onChange={handleMinutesChange}
              className="h-10 w-20 text-center text-lg font-semibold"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={decrementMinutes}
            >
              <ChevronDown />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
