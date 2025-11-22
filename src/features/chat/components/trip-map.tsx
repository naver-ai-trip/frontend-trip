import { PlaceResult } from "@/app/(main)/trip/[tripId]/page";
import { useChatComponent } from "@/hooks/use-chat-component";
import "mapbox-gl/dist/mapbox-gl.css";
import { useCallback, useEffect, useRef } from "react";
import Map, { FullscreenControl, MapRef, Marker, ScaleControl } from "react-map-gl/mapbox";

export const TripMap = () => {
  const { components } = useChatComponent();
  const mapRef = useRef<MapRef | null>(null);

  const handleResize = () => {
    if (mapRef.current) {
      mapRef.current.resize();
    }
  };

  const fitMapToPlaces = useCallback(() => {
    if (!mapRef.current || !components || components.length === 0) return;

    const places = components as PlaceResult[];

    if (places.length === 1) {
      mapRef.current.flyTo({
        center: [places[0].longitude, places[0].latitude],
        zoom: 14,
        duration: 1500,
      });
    } else {
      const bounds: [[number, number], [number, number]] = places.reduce(
        (acc, place) => {
          return [
            [Math.min(acc[0][0], place.longitude), Math.min(acc[0][1], place.latitude)],
            [Math.max(acc[1][0], place.longitude), Math.max(acc[1][1], place.latitude)],
          ];
        },
        [
          [places[0].longitude, places[0].latitude],
          [places[0].longitude, places[0].latitude],
        ],
      );

      mapRef.current.fitBounds(bounds, {
        padding: 100,
        duration: 1500,
      });
    }
  }, [components]);

  useEffect(() => {
    handleResize();
  }, []);

  useEffect(() => {
    handleResize();
    fitMapToPlaces();
  }, [components, fitMapToPlaces]);

  return (
    <Map
      ref={mapRef}
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
      {components &&
        components.map((component, index) => (
          <Marker
            key={index}
            latitude={component.latitude}
            longitude={component.longitude}
            anchor="bottom"
          >
            <div className="group relative cursor-pointer">
              <div className="relative">
                <div className="flex h-8 w-8 transform items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg transition-transform duration-200 group-hover:scale-110">
                  <div className="h-3 w-3 rounded-full bg-white" />
                </div>
                <div className="absolute top-6 left-1/2 h-0 w-0 -translate-x-1/2 border-t-8 border-r-4 border-l-4 border-t-purple-500 border-r-transparent border-l-transparent" />
              </div>
            </div>
          </Marker>
        ))}
    </Map>
  );
};
