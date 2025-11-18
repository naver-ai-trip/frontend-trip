import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plane, Volume2 } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import 'mapbox-gl/dist/mapbox-gl.css'
import Map, { Marker } from 'react-map-gl/mapbox'

interface Country {
  name: string
  code: string
  latitude: number
  longitude: number
  image: string
  videoUrl?: string
  date: string
  price: string
  currency: string
  username?: string
}

const COUNTRIES_DATA: Country[] = [
  {
    name: "South Korea",
    code: "KR",
    latitude: 37.5665,
    longitude: 126.9780,
    image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&h=600&fit=crop',
    videoUrl: '/south-korea.mp4',
    date: '8 Dec 2025',
    price: '₫7,526,966',
    currency: 'per person',
    username: '@wisteri_voyage'
  },
  {
    name: "Japan",
    code: "JP",
    latitude: 35.6762,
    longitude: 139.6503,
    image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&h=600&fit=crop',
    videoUrl: '/japan.mp4',
    date: '15 Dec 2025',
    price: '₫8,200,000',
    currency: 'per person',
    username: '@kidgintang'
  },
  {
    name: "Thailand",
    code: "TH",
    latitude: 13.7563,
    longitude: 100.5018,
    image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&h=600&fit=crop',
    date: '10 Jan 2026',
    price: '₫4,468,756',
    currency: 'per person'
  },
  {
    name: "Singapore",
    code: "SG",
    latitude: 1.3521,
    longitude: 103.8198,
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&h=600&fit=crop',
    date: '20 Jan 2026',
    price: '₫3,413,130',
    currency: 'per person'
  },
  {
    name: "Malaysia",
    code: "MY",
    latitude: 3.1390,
    longitude: 101.6869,
    image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&h=600&fit=crop',
    date: '5 Feb 2026',
    price: '₫2,402,249',
    currency: 'per person'
  },
  {
    name: "Philippines",
    code: "PH",
    latitude: 14.5995,
    longitude: 120.9842,
    image: 'https://images.unsplash.com/photo-1580541631950-7282082b53ce?w=800&h=600&fit=crop',
    date: '12 Feb 2026',
    price: '₫12,693,680',
    currency: 'per person'
  },
  {
    name: "Indonesia",
    code: "ID",
    latitude: -6.2088,
    longitude: 106.8456,
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=600&fit=crop',
    date: '18 Feb 2026',
    price: '₫6,430,857',
    currency: 'per person'
  },
  {
    name: "Taiwan",
    code: "TW",
    latitude: 25.0330,
    longitude: 121.5654,
    image: 'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?w=800&h=600&fit=crop',
    date: '25 Feb 2026',
    price: '₫7,502,311',
    currency: 'per person'
  }
]

export const SelectCountry = () => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)

  return (
    <div className="grid grid-cols-3 h-screen ">
      <ScrollArea className="col-span-1 h-full flex flex-col  border-r">
        <div className="flex-1 h-[300px]">
          <div className="p-4 space-y-4">
            {COUNTRIES_DATA.map((country) => (
              <Card
                key={country.code}
                className={`overflow-hidden p-0 cursor-pointer transition-all 
                  hover:shadow-lg ${selectedCountry === country.code ? 'ring-2 ring-blue-500' : ''
                  }`}
                onClick={() => setSelectedCountry(country.code)}
              >
                <div className="relative h-64 w-full">
                  {/* Country Image/Video */}
                  <Image
                    src={country.image}
                    alt={country.name}
                    fill
                    className="object-cover"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Sound Icon */}
                  {country.videoUrl && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-3 right-3 bg-black/30 hover:bg-black/50 text-white"
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  )}

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded">
                        BEST VIEW
                      </span>
                      <h3 className="text-xl font-bold">Cafe</h3>
                    </div>
                    <p className="text-sm mb-3">in Busan Korea</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">{country.name}</span>
                        <span className="text-2xl">{getFlagEmoji(country.code)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span>📅 {country.date}</span>
                        <span>✈️ From {country.price} {country.currency}</span>
                      </div>
                    </div>

                    {country.username && (
                      <div className="flex items-center gap-2 mt-2">
                        <div className="w-6 h-6 rounded-full" />
                        <span className="text-xs">{country.username}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Select Button */}
                <div className="p-3 ">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedCountry(country.code)
                    }}
                  >
                    + Select
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </ScrollArea>

      {/* Right Panel - Map */}
      <div className="col-span-2 h-full relative">
        <Map
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
          initialViewState={{
            longitude: 105,
            latitude: 15,
            zoom: 4,
          }}
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
        >
          {/* Country Markers */}
          {COUNTRIES_DATA.map((country) => (
            <Marker
              key={country.code}
              longitude={country.longitude}
              latitude={country.latitude}
              anchor="bottom"
            >
              <div
                className={`cursor-pointer transition-transform hover:scale-110 ${selectedCountry === country.code ? 'scale-125' : ''
                  }`}
                onClick={() => setSelectedCountry(country.code)}
              >
                {/* Marker with price */}
                <div className="relative">
                  <div className="bg-white shadow-lg rounded-lg px-3 py-2 flex items-center gap-2 border-2 border-blue-500">
                    <Plane className="h-4 w-4 text-blue-600" />
                    <div className="text-xs">
                      <div className="font-bold text-blue-600">{country.price}</div>
                      <div className="text-gray-600">{country.name}</div>
                    </div>
                  </div>
                  {/* Arrow pointer */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-blue-500" />
                </div>
              </div>
            </Marker>
          ))}
        </Map>
      </div>
    </div >
  )
}

// Helper function to get flag emoji
function getFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}
