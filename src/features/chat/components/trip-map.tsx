import React from 'react'
import Map, { FullscreenControl, ScaleControl, Marker } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import Image from 'next/image'

const locationsInJapan = [
  {
    latitude: 35.6895,
    longitude: 139.6917,
    name: 'Tokyo',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop',
    description: 'Capital of Japan'
  },
  {
    latitude: 34.6937,
    longitude: 135.5023,
    name: 'Osaka',
    image: 'https://images.unsplash.com/photo-1589452271712-64271b2f3f2b?w=400&h=300&fit=crop',
    description: 'Modern city with rich history'
  },
  {
    latitude: 35.0116,
    longitude: 135.7681,
    name: 'Kyoto',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop',
    description: 'Ancient temples and gardens'
  },
  {
    latitude: 43.0618,
    longitude: 141.3545,
    name: 'Sapporo',
    image: 'https://images.unsplash.com/photo-1623679448392-e2d0bb5d6d66?w=400&h=300&fit=crop',
    description: 'Snow festival city'
  },
  {
    latitude: 33.5902,
    longitude: 130.4017,
    name: 'Fukuoka',
    image: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=400&h=300&fit=crop',
    description: 'Gateway to Kyushu'
  },
]

export const TripMap = () => {
  return (
    <Map
      // ref={mapRef}
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
      initialViewState={{
        longitude: -100,
        latitude: 40,
        zoom: 3.5,
      }}
      style={{ width: "100%", height: "100%" }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
    >
      <FullscreenControl />
      <ScaleControl />
      {locationsInJapan.map((location, index) => (
        <Marker
          key={index}
          latitude={location.latitude}
          longitude={location.longitude}
          anchor="bottom"
        >
          <div className="relative group cursor-pointer">
            <div className="relative">
              <div className="absolute -inset-2 bg-purple-500/30 rounded-full blur-md animate-pulse" />

              <div className="relative w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-lg transform group-hover:scale-110 transition-transform duration-200 flex items-center justify-center border-2 border-white">
                <div className="w-3 h-3 bg-white rounded-full" />
              </div>

              <div className="absolute left-1/2 -translate-x-1/2 top-6 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-8 border-t-purple-500" />
            </div>

            {/* Hover Card with Image */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none transform group-hover:translate-y-0 translate-y-2">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 w-64">
                {/* Image */}
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={location.image}
                    alt={location.name}
                    width={256}
                    height={160}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-3">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                    {location.name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {location.description}
                  </p>
                </div>

                {/* Arrow pointer */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-white dark:border-t-slate-800" />
              </div>
            </div>

            <div className="absolute top-0 left-0 w-8 h-8 bg-purple-500/20 rounded-full animate-ping" />
          </div>
        </Marker>
      ))}
    </Map>
  )
}
