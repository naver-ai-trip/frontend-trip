import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Calendar, ChevronLeft, MapPin, PhoneCall, Search, Users } from 'lucide-react'
import 'mapbox-gl/dist/mapbox-gl.css'
import Map from 'react-map-gl/mapbox'
import Image from 'next/image'
import React, { useState } from 'react'
interface Hotel {
  id: string
  name: string
  location: string
  image: string
  description: string
  rating: number
  reviewCount: number
  amenities: string[]
  originalPrice?: number
  currentPrice: number
  currency: string
  stars: number
  features: string[]
}

const DUMMY_HOTELS: Hotel[] = [
  {
    id: '1',
    name: 'Minh Boutique',
    location: 'Da Nang',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
    description: 'This hotel in Da Nang offers a great location close to My Khe Beach and features an outdoor swimming pool and free bikes,...',
    rating: 9.5,
    reviewCount: 3075,
    amenities: ['Outdoor Pool', 'Free Parking'],
    originalPrice: 5246472,
    currentPrice: 4721825,
    currency: 'đ',
    stars: 4,
    features: ['Outdoor Pool', 'Free Parking']
  },
  {
    id: '2',
    name: 'Chi House Danang Hotel and Apartment',
    location: 'Da Nang',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop',
    description: 'This hotel offers a 4-star experience with excellent facilities including an outdoor swimming pool, fitness centre, and sauna,...',
    rating: 9.2,
    reviewCount: 284,
    amenities: ['4-star', 'outdoor swimming pool', 'fitness centre'],
    currentPrice: 3850000,
    currency: 'đ',
    stars: 4,
    features: ['outdoor swimming pool', 'fitness centre', 'sauna']
  },
  {
    id: '3',
    name: 'Fusion Suites Da Nang Beach',
    location: 'Da Nang',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop',
    description: 'Luxury beachfront hotel with all-inclusive breakfast and spa services. Perfect for families and couples.',
    rating: 9.0,
    reviewCount: 1542,
    amenities: ['Beachfront', 'Spa', 'Restaurant'],
    currentPrice: 5200000,
    currency: 'đ',
    stars: 5,
    features: ['Beachfront', 'Spa', 'Restaurant', 'Free Breakfast']
  }
]

interface BookingProps {
  handleChangeView?: (view: 'overview' | 'booking' | 'custom') => void
}

export const Booking = ({ handleChangeView }: BookingProps) => {
  const [searchQuery, setSearchQuery] = useState('Da Nang')
  const [dateRange, setDateRange] = useState('Mon, Dec 15 – Thu, Dec 18')
  const [guests, setGuests] = useState('1 Adult')

  return (
    <div>
      <div className='border-b pb-2'>
        <Button className='mt-4 ml-4' variant={'outline'} onClick={() => handleChangeView && handleChangeView('overview')}>
          <ChevronLeft /> Back to Overview
        </Button>
      </div>
      <ResizablePanelGroup direction='horizontal' className='grid grid-cols-5 h-screen'>
        <ResizablePanel minSize={40} className='col-span-3 w-1/z h-[calc(100vh-130px)] flex flex-col'>
          <div className='p-6 border-b bg-white'>
            <h1 className='text-2xl font-bold mb-4'>
              Hotels in Da Nang, Vietnam under 60 euros per night (Dec 2025)
            </h1>
            <div className='grid grid-cols-3 gap-3 mb-4'>
              <div className='relative'>
                <MapPin className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='pl-9'
                  placeholder='Destination'
                />
              </div>
              <div className='relative'>
                <Calendar className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
                <Input
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className='pl-9'
                  placeholder='Check-in - Check-out'
                />
              </div>
              <div className='relative'>
                <Users className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
                <Input
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className='pl-9'
                  placeholder='Guests'
                />
              </div>
            </div>

            <div className='relative'>
              <Input
                placeholder='S'
                className='pr-12'
              />
              <Button size='icon' className='absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-cyan-500 hover:bg-cyan-600'>
                <Search className='h-4 w-4' />
              </Button>
            </div>
          </div>

          <ScrollArea className='flex-1 h-1/2'>
            <div className='p-6 space-y-4'>
              {DUMMY_HOTELS.map((hotel) => (
                <Card key={hotel.id} className='overflow-hidden border-2 p-0 border-green-500'>
                  <div className='flex gap-4 p-2'>
                    <div className='relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden'>
                      <Image
                        src={hotel.image}
                        alt={hotel.name}
                        fill
                        className='object-cover'
                      />
                    </div>
                    <div className='flex-1 flex flex-col'>
                      <div className='flex-1'>
                        <h3 className='text-lg font-bold mb-2'>{hotel.name}</h3>

                        <div className='flex items-center gap-1 mb-1'>
                          <span className='text-sm text-blue-600 font-medium'>{hotel.location}</span>
                          {hotel.amenities.map((amenity, idx) => (
                            <React.Fragment key={idx}>
                              <span className='text-sm px-2 py-1 bg-blue-50 text-blue-700 rounded'>
                                {amenity}
                              </span>
                            </React.Fragment>
                          ))}
                        </div>

                        <p className='text-sm text-gray-600 mb-3 line-clamp-2'>
                          Booking: &ldquo;{hotel.description}&rdquo;
                        </p>

                        <div className='flex justify-between'>
                          <div className='flex items-center gap-2'>
                            <div className='bg-blue-600 text-white px-2 py-1 rounded font-bold text-sm'>
                              {hotel.rating}
                            </div>
                            <div className='flex flex-col'>
                              <span className='font-semibold'>Wonderful</span>
                              <span className='text-sm text-gray-500'>({hotel.reviewCount.toLocaleString()} reviews)</span>
                            </div>
                          </div>
                          <Button size='sm' className=''>
                            <PhoneCall /> Book Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel minSize={40} defaultSize={50} className='col-span-2 h-[calc(100vh-130px)] w-full'>
          <Map
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
            initialViewState={{
              longitude: 105,
              latitude: 15,
              zoom: 4,
            }}
            style={{ width: "100%", height: "100%" }}
            mapStyle="mapbox://styles/mapbox/streets-v11"
          ></Map>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
