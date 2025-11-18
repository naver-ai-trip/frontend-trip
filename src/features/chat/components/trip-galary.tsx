import { Card } from '@/components/ui/card'
import Image from 'next/image'
import React, { useState } from 'react'
import { Heart, Share2, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

const galleryImages = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop',
    alt: 'Kyoto Temple'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop',
    alt: 'Tokyo Tower'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=800&h=600&fit=crop',
    alt: 'Osaka Castle'
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=800&h=600&fit=crop',
    alt: 'Mount Fuji'
  },
]

export const TripGallery = () => {
  const [liked, setLiked] = useState(false)

  return (
    <Card className='w-full h-full overflow-hidden group p-0 relative'>
      {/* Main Image Grid */}
      <div className='grid grid-cols-4 grid-rows-2 gap-1 h-full'>
        {/* Large Image - Left Side */}
        <div className='col-span-2 row-span-2 relative overflow-hidden'>
          <Image
            src={galleryImages[0].url}
            width={800}
            height={600}
            alt={galleryImages[0].alt}
            className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
        </div>

        {/* Top Right Images */}
        <div className='col-span-2 relative overflow-hidden'>
          <Image
            src={galleryImages[1].url}
            width={800}
            height={600}
            alt={galleryImages[1].alt}
            className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
        </div>

        {/* Bottom Right - 2 Small Images */}
        <div className='relative overflow-hidden'>
          <Image
            src={galleryImages[2].url}
            width={800}
            height={600}
            alt={galleryImages[2].alt}
            className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
        </div>

        <div className='relative overflow-hidden'>
          <Image
            src={galleryImages[3].url}
            width={800}
            height={600}
            alt={galleryImages[3].alt}
            className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

          {/* View All Photos Button */}
          <div className='absolute inset-0 flex items-center justify-center bg-black/40'>
            <Button
              variant="secondary"
              size="sm"
              className='bg-white/90 hover:bg-white text-slate-900 font-medium'
            >
              View all photos
            </Button>
          </div>
        </div>
      </div>

      {/* Action Buttons - Top Right */}
      <div className='absolute top-4 right-4 flex gap-2 z-10'>
        <Button
          variant="secondary"
          size="sm"
          className='bg-white/90 hover:bg-white backdrop-blur-sm shadow-lg'
        >
          <Share2 className='h-4 w-4 mr-1' />
          Share
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setLiked(!liked)}
          className={`backdrop-blur-sm shadow-lg ${liked
            ? 'bg-primary text-white hover:bg-primary/90'
            : 'bg-white/90 hover:bg-white'
            }`}
        >
          <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
        </Button>
      </div>

      {/* Rating Badge - Top Left */}
      <div className='absolute top-4 left-4 z-10'>
        <div className='bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-lg flex items-center gap-1'>
          <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
          <span className='font-semibold text-sm'>4.9</span>
          <span className='text-slate-500 text-sm'>(128)</span>
        </div>
      </div>
    </Card>
  )
}
