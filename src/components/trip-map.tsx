'use client'

import React, { forwardRef, useEffect, useState, useCallback } from 'react'
import Map, { Marker, MapRef, ViewStateChangeEvent } from 'react-map-gl/mapbox'
import { Search, Clock, Loader } from 'lucide-react'
import 'mapbox-gl/dist/mapbox-gl.css'
import { PlaceResult } from '@/app/(main)/trip/[tripId]/page'
import { useQuery } from '@tanstack/react-query'
import { mapService } from '@/services/map-service'
import { AnimatedRouteLayer } from './animated-route-layer'
import mapboxgl from 'mapbox-gl'
import { placesService } from '@/services/places-service'

interface Place {
  id: number
  name: string
  address: string
  latitude: number
  longitude: number
  category: string
}

interface Itinerary {
  id?: number
  trip_id: number
  title: string
  day_number: number
  start_time: string
  end_time: string
  place_id: number
  description: string
  place?: Place
}

interface TripMapProps {
  searchResults?: PlaceResult[]
  itineraries?: Itinerary[]
  selectedDay: number
  onAddPlace: (place: PlaceResult) => void
  userLocation?: { latitude: number; longitude: number }
  routes?: {
    start_lat: number
    start_lng: number
    goal_lat: number
    goal_lng: number
    option: string
  }
}

const TripMap = forwardRef<MapRef, TripMapProps>(
  ({ searchResults = [], itineraries = [], selectedDay, onAddPlace, routes }, ref) => {
    const [dragEndPosition, setDragEndPosition] = useState<{ lat: number; lng: number } | null>(null)

    // Check if there's an active route
    const hasActiveRoute = routes?.goal_lat && routes?.goal_lng && routes?.start_lat && routes?.start_lng

    const { data: routeData } = useQuery({
      queryKey: ['directions', routes],
      queryFn: async () => {
        if (!routes?.goal_lat || !routes.goal_lng || !routes.start_lat || !routes.start_lng) return null
        const res = await mapService.getDirections(routes)
        return res
      },
      enabled: !!routes,
    })

    const { data: nearbyPlaces, isFetching } = useQuery({
      queryKey: ['nearbyPlaces', dragEndPosition],
      queryFn: async () => {
        if (!dragEndPosition) return null
        const res = await placesService.searchPlacesNearby(
          dragEndPosition.lat,
          dragEndPosition.lng,
          'restaurant',
          1000
        )
        return res
      },
      enabled: !!dragEndPosition && !hasActiveRoute, // Disable when route is active
      retry: false,
      staleTime: 300000, // 5 minutes
    })

    const handleDragStart = useCallback(() => {
      // Clear previous nearby places when starting to drag
      setDragEndPosition(null)
    }, [])

    const handleDragEnd = useCallback((e: ViewStateChangeEvent) => {
      // Don't search for nearby places if there's an active route
      if (hasActiveRoute) return

      if (e.viewState) {
        const { longitude, latitude } = e.viewState
        setDragEndPosition({ lat: latitude, lng: longitude })
      }
    }, [hasActiveRoute])

    let routeGeoJSON = null

    if (routeData?.data?.path && Array.isArray(routeData.data.path)) {
      const validCoordinates = routeData.data.path.filter((point: unknown) => {
        return Array.isArray(point) && point.length >= 2 &&
          typeof point[0] === 'number' && typeof point[1] === 'number' &&
          !isNaN(point[0]) && !isNaN(point[1])
      })

      if (validCoordinates.length >= 2) {
        routeGeoJSON = {
          type: 'Feature' as const,
          properties: {},
          geometry: {
            type: 'LineString' as const,
            coordinates: validCoordinates,
          },
        }
      }
    }

    // Clear nearby places when route becomes active
    useEffect(() => {
      if (hasActiveRoute) {
        setDragEndPosition(null)
      }
    }, [hasActiveRoute])

    // Fit map to route bounds when route data is loaded
    useEffect(() => {
      if (routeGeoJSON && ref && typeof ref !== 'function' && ref.current) {
        const coordinates = routeGeoJSON.geometry.coordinates as [number, number][]

        if (coordinates.length > 0) {
          const bounds = coordinates.reduce(
            (bounds, coord) => {
              return bounds.extend(coord as [number, number])
            },
            new mapboxgl.LngLatBounds(coordinates[0], coordinates[0])
          )

          ref.current.fitBounds(bounds, {
            padding: { top: 50, bottom: 50, left: 50, right: 50 },
            duration: 1000,
          })
        }
      }
    }, [routeGeoJSON, ref])

    return (
      <div className="relative w-full h-full">
        <Map
          ref={ref}
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
          // korea
          initialViewState={{
            longitude: 127.024612,
            latitude: 37.532600,
            zoom: 8,
          }}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/streets-v11"

          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {isFetching && <div>
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-lg border z-10">
              <Loader className="w-5 h-5 mr-2 inline-block text-gray-500 animate-spin" />
              Searching for nearby places...
            </div>
          </div>}
          {routeGeoJSON && <AnimatedRouteLayer routeGeoJSON={routeGeoJSON} />}
          {routes?.goal_lat && routes?.goal_lng && routes?.start_lat && routes?.start_lng &&
            <>
              <>
                <Marker
                  latitude={routes.start_lat}
                  longitude={routes.start_lng}
                  anchor="bottom"
                >
                  <div className="relative group cursor-pointer">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-3 border-white shadow-lg flex items-center justify-center transform transition-all duration-200 group-hover:scale-110 group-hover:shadow-xl ring-2 ring-green-200">
                        <span className="text-white font-bold text-sm drop-shadow">S</span>
                      </div>
                      <div className="absolute top-9 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-5 border-r-5 border-t-5 border-transparent border-t-green-500"></div>
                    </div>
                    <div className="absolute top-0 left-0 w-10 h-10 bg-green-500/30 rounded-full animate-ping"></div>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                      <div className="bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg border min-w-max max-w-xs">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          Start
                        </div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white dark:border-t-gray-800"></div>
                      </div>
                    </div>
                  </div>
                </Marker>
              </>

              <Marker
                latitude={routes.goal_lat}
                longitude={routes.goal_lng}
                anchor="bottom"
              >
                <div className="relative group cursor-pointer">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-full border-3 border-white shadow-lg flex items-center justify-center transform transition-all duration-200 group-hover:scale-110 group-hover:shadow-xl ring-2 ring-red-200">
                      <span className="text-white font-bold text-sm drop-shadow">E</span>
                    </div>
                    <div className="absolute top-9 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-5 border-r-5 border-t-5 border-transparent border-t-red-500"></div>
                  </div>
                  <div className="absolute top-0 left-0 w-10 h-10 bg-red-500/30 rounded-full animate-ping"></div>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                    <div className="bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg border min-w-max max-w-xs">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        Destination
                      </div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white dark:border-t-gray-800"></div>
                    </div>
                  </div>
                </div>
              </Marker>
            </>
          }



          {searchResults.map((place: PlaceResult, index: number) => (
            <Marker
              latitude={place.latitude}
              longitude={place.longitude}
              key={`search-${place.latitude}-${place.longitude}-${index}`}
              anchor="bottom"
            >
              <div className="relative group cursor-pointer">
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center transform transition-all duration-200 group-hover:scale-110 group-hover:shadow-xl ring-2 ring-blue-200">
                    <Search className="w-3 h-3 text-white drop-shadow" />
                  </div>
                  <div className="absolute top-7 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-500"></div>
                </div>
                <div className="absolute top-0 left-0 w-8 h-8 bg-blue-500/30 rounded-full animate-ping"></div>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                  <div className="bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg border min-w-max max-w-xs">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {place.name}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300 truncate">
                      {place.category}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {place.address}
                    </div>
                    <div className="mt-2 pt-2 border-t">
                      <button
                        className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground px-2 py-1 rounded pointer-events-auto transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          onAddPlace(place)
                        }}
                      >
                        Add to Day {selectedDay}
                      </button>
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white dark:border-t-gray-800"></div>
                  </div>
                </div>
              </div>
            </Marker>
          ))}

          {/* User Location Marker */}
          {/* {userLocation && (
            <Marker latitude={userLocation.latitude} longitude={userLocation.longitude}>
              <div className="bg-white rounded-full p-2 shadow">
                <User />
              </div>
            </Marker>
          )} */}

          {/* Nearby Places on Mouse Hover */}
          {nearbyPlaces && Array.isArray(nearbyPlaces) && nearbyPlaces.map((place: Place, index: number) => (
            <Marker
              latitude={place.latitude}
              longitude={place.longitude}
              key={`nearby-${place.id || index}`}
              anchor="bottom"
            >
              <div className="relative group cursor-pointer">
                <div className="relative">
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center transform transition-all duration-200 group-hover:scale-110 group-hover:shadow-xl ring-2 ring-purple-200">
                    <span className="text-white text-xs">🍽️</span>
                  </div>
                </div>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                  <div className="bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg border min-w-max max-w-xs">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {place.name}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300 truncate">
                      {place.category}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {place.address}
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white dark:border-t-gray-800"></div>
                  </div>
                </div>
              </div>
            </Marker>
          ))}

          {/* Itinerary Markers */}
          {itineraries.map((item, idx) => (
            <Marker
              latitude={item.place?.latitude || 35.6762}
              longitude={item.place?.longitude || 139.6503}
              key={`itinerary-${item.id}-${idx}`}
              anchor="bottom"
            >
              <div className="relative group cursor-pointer">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-3 border-white shadow-lg flex items-center justify-center transform transition-all duration-200 group-hover:scale-110 group-hover:shadow-xl ring-2 ring-green-200">
                    <span className="text-white font-bold text-sm drop-shadow">{idx + 1}</span>
                  </div>
                  <div className="absolute top-9 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-5 border-r-5 border-t-5 border-transparent border-t-green-500"></div>
                </div>
                <div className="absolute top-0 left-0 w-10 h-10 bg-green-500/30 rounded-full animate-ping"></div>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                  <div className="bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg border min-w-max max-w-xs">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-3 h-3 text-green-500" />
                      <span className="text-xs font-medium text-green-600 dark:text-green-400">
                        {item.start_time} - {item.end_time}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {item.title}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {item.description}
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white dark:border-t-gray-800"></div>
                  </div>
                </div>
              </div>
            </Marker>
          ))}
        </Map>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border p-3 space-y-2 z-10">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Legend</h4>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full border border-white"></div>
            <span className="text-xs text-gray-600 dark:text-gray-300">Search Results</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full border border-white flex items-center justify-center">
              <span className="text-white text-xs font-bold">1</span>
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-300">Itinerary Items</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded-full border border-white flex items-center justify-center">
              <span className="text-xs">🍽️</span>
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-300">Nearby Places</span>
          </div>
          {routeData?.data && (
            <>
              <div className="border-t pt-2 mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-1 bg-blue-500"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-300">Route</span>
                </div>
              </div>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Distance:</span>
                  <span className="font-medium">{(routeData.data.distance / 1000).toFixed(1)} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Duration:</span>
                  <span className="font-medium">{Math.round(routeData.data.duration / 60000)} min</span>
                </div>
                {routeData.data.tollFare > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Toll:</span>
                    <span className="font-medium">{routeData.data.tollFare.toLocaleString()}₫</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    )
  }
)

TripMap.displayName = 'TripMap'

export default TripMap
