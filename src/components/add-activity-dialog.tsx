'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { TimePicker } from '@/components/ui/time-picker'
import { MapPin } from 'lucide-react'
import { PlaceResult } from '@/app/(main)/trip/[tripId]/page'


interface ItineraryItem {
  id: number
  start_time: string
  end_time: string
  title: string
}

interface AddActivityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  dayNumber: number
  onSubmit: (data: {
    title: string
    description: string
    start_time: string
    end_time: string
    place_id: number
  }) => void
  draggedPlace?: PlaceResult | null
  existingItineraries?: ItineraryItem[]
}

export function AddActivityDialog({
  open,
  onOpenChange,
  dayNumber,
  onSubmit,
  draggedPlace,
  existingItineraries = [],
}: AddActivityDialogProps) {
  const [title, setTitle] = useState(draggedPlace?.name || '')
  const [description, setDescription] = useState(draggedPlace?.address || '')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('11:00')
  const [timeError, setTimeError] = useState('')

  React.useEffect(() => {
    if (open) {
      if (draggedPlace) {
        setTitle(draggedPlace.name)
        setDescription(draggedPlace.address)
      } else {
        setTitle('')
        setDescription('')
      }
      setStartTime('09:00')
      setEndTime('11:00')
    }
  }, [open, draggedPlace])

  const checkTimeOverlap = (newStart: string, newEnd: string): string | null => {
    const newStartMinutes = timeToMinutes(newStart)
    const newEndMinutes = timeToMinutes(newEnd)

    for (const item of existingItineraries) {
      const existingStart = timeToMinutes(item.start_time.substring(0, 5))
      const existingEnd = timeToMinutes(item.end_time.substring(0, 5))

      // Check if times overlap
      if (
        (newStartMinutes >= existingStart && newStartMinutes < existingEnd) ||
        (newEndMinutes > existingStart && newEndMinutes <= existingEnd) ||
        (newStartMinutes <= existingStart && newEndMinutes >= existingEnd)
      ) {
        return `Time conflicts with "${item.title}" (${item.start_time.substring(0, 5)} - ${item.end_time.substring(0, 5)})`
      }
    }
    return null
  }

  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTimeError('')

    if (startTime >= endTime) {
      setTimeError('End time must be after start time')
      return
    }

    const overlap = checkTimeOverlap(startTime, endTime)
    if (overlap) {
      setTimeError(overlap)
      return
    }

    onSubmit({
      title,
      description,
      start_time: startTime + ':00',
      end_time: endTime + ':00',
      place_id: 0,
    })

    setTitle('')
    setDescription('')
    setStartTime('09:00')
    setEndTime('11:00')
    setTimeError('')
    onOpenChange(false)
  }

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
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg border">
                <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{draggedPlace.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {draggedPlace.category}
                  </p>
                </div>
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
              <TimePicker
                label="Start Time"
                value={startTime}
                onChange={setStartTime}
              />
              <TimePicker
                label="End Time"
                value={endTime}
                onChange={setEndTime}
              />
            </div>

            <div className="text-sm text-muted-foreground text-center">
              Duration: {calculateDuration(startTime, endTime)}
            </div>

            {/* Time Error Message */}
            {timeError && (
              <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3">
                <p className="font-medium">⚠️ {timeError}</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setTimeError('')
                onOpenChange(false)
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Add Activity</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function calculateDuration(start: string, end: string): string {
  const [startHour, startMin] = start.split(':').map(Number)
  const [endHour, endMin] = end.split(':').map(Number)

  const startMinutes = startHour * 60 + startMin
  const endMinutes = endHour * 60 + endMin

  const diffMinutes = endMinutes - startMinutes

  if (diffMinutes < 0) return 'Invalid'

  const hours = Math.floor(diffMinutes / 60)
  const minutes = diffMinutes % 60

  if (hours === 0) return `${minutes} minutes`
  if (minutes === 0) return `${hours} hour${hours > 1 ? 's' : ''}`
  return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} min`
}
