'use client'

import { useEffect, useRef } from 'react'
import { useMap } from 'react-map-gl/mapbox'

interface AnimatedRouteLayerProps {
  routeGeoJSON: {
    type: 'Feature'
    properties: object
    geometry: {
      type: 'LineString'
      coordinates: number[][]
    }
  }
}

const dashArraySequence = [
  [0, 4, 3],
  [0.5, 4, 2.5],
  [1, 4, 2],
  [1.5, 4, 1.5],
  [2, 4, 1],
  [2.5, 4, 0.5],
  [3, 4, 0],
  [0, 0.5, 3, 3.5],
  [0, 1, 3, 3],
  [0, 1.5, 3, 2.5],
  [0, 2, 3, 2],
  [0, 2.5, 3, 1.5],
  [0, 3, 3, 1],
  [0, 3.5, 3, 0.5]
]

export function AnimatedRouteLayer({ routeGeoJSON }: AnimatedRouteLayerProps) {
  const { current: map } = useMap()
  const animationRef = useRef<number | undefined>(undefined)
  const stepRef = useRef(0)

  useEffect(() => {
    if (!map) {
      return
    }

    const mapInstance = map.getMap()

    const cleanup = () => {
      try {
        if (mapInstance.getLayer('route-line-dashed')) {
          mapInstance.removeLayer('route-line-dashed')
        }
        if (mapInstance.getLayer('route-line-background')) {
          mapInstance.removeLayer('route-line-background')
        }
        if (mapInstance.getSource('route')) {
          mapInstance.removeSource('route')
        }
      } catch (e) {
        console.warn('Cleanup error:', e)
      }
    }

    const initializeRoute = () => {
      cleanup()

      try {
        mapInstance.addSource('route', {
          type: 'geojson',
          data: routeGeoJSON
        })
        mapInstance.addLayer({
          id: 'route-line-background',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#2f22e5',
            'line-width': 8,
            'line-opacity': 0.5
          }
        })

        mapInstance.addLayer({
          id: 'route-line-dashed',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#2f22e5',
            'line-width': 8,
            'line-dasharray': [0, 4, 3]
          }
        })

        // Start animation
        const animateDashArray = (timestamp: number) => {
          const newStep = parseInt(
            String((timestamp / 50) % dashArraySequence.length)
          )

          if (newStep !== stepRef.current) {
            try {
              mapInstance.setPaintProperty(
                'route-line-dashed',
                'line-dasharray',
                dashArraySequence[stepRef.current]
              )
              stepRef.current = newStep
            } catch (e) {
              console.warn('Animation error:', e)
            }
          }

          animationRef.current = requestAnimationFrame(animateDashArray)
        }

        animateDashArray(0)
      } catch (e) {
        console.error('❌ Error initializing route:', e)
      }
    }

    if (mapInstance.loaded()) {
      initializeRoute()
    } else {
      mapInstance.once('load', () => {
        initializeRoute()
      })
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      cleanup()
    }
  }, [map, routeGeoJSON])

  return null
}