import { PlaceDatum } from '@/services/places-service'
import { Heart, Star } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

export const CardItem = ({ place, handleAddToFavorite }: { place: PlaceDatum, handleAddToFavorite: (placeId: number) => void }) => {
  return (
    <div>
      <div className='rounded-lg overflow-hidden relative'>
        <span className='p-2 absolute top-2 right-2  bg-secondary rounded-full'
          onClick={() => handleAddToFavorite(place.id)}
        >
          <Heart className='size-6 text-primary' />
        </span>
        <Image
          alt='image'
          width={450}
          height={450}
          className='aspect-square object-cover'
          src={'https://www.usnews.com/object/image/0000016f-afc4-d65c-a7ef-ffe443990000/26-fiord-getty.jpg?update-time=1579201872803&size=responsive640'}
        />
      </div>
      <div className='mt-2'>
        <div className='flex justify-between'>
          <div className='font-semibold text-base'>{place.name}</div>
          <div className='flex gap-1 items-center justify-center'>
            <Star />
            <span>4.8</span>
          </div>
        </div>
        <div className='text-sm text-muted-foreground text-left'>{place.address}</div>
      </div>
    </div>
  )
}
