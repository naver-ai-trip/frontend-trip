import React from 'react'
import { NameTrip } from './components/name-trip'
import { TripGallery } from './components/trip-galary'
import { TripMap } from './components/trip-map'
import { ScrollArea } from '@/components/ui/scroll-area'
import { TripTimeLine } from './components/trip-time-line'

interface OverviewProps {
  handleOpen: () => void
  handleChangeView?: (view: 'overview' | 'booking' | 'custom') => void
}

export const Overview = ({ handleOpen, handleChangeView }: OverviewProps) => {
  return (
    <ScrollArea className='h-screen overflow-y-scroll flex flex-col gap-8 p-4'>
      <div className='grid grid-cols-5 gap-4 min-h-[50vh]'>
        <div className='col-span-3 gap-4 flex flex-col'>
          <div className='flex-1'>
            <NameTrip handleOpen={handleOpen} />
          </div>
          <div className='flex-1'>
            <TripGallery />
          </div>
        </div>
        <div className='col-span-2'>
          <TripMap />
        </div>
      </div>
      <div className='py-10'>
        <div className='text-2xl mb-4'>
          Trip Overview
        </div>
        <TripTimeLine handleChangeView={handleChangeView} />
      </div>
    </ScrollArea>
  )
}
