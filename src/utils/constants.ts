export const AUTH = {
  GET_GOOGLE_AUTH_URL: "/auth/google",
  GOOGLE_CALLBACK: "/auth/google/callback",
};

export const TRIPS = {
  CREATE_TRIP: "/trips",
  GET_TRIPS: "/trips",
  GET_TRIP_DETAILS: (tripId: string) => `/trips/${tripId}`,
  DELETE_TRIP: (tripId: string) => `/trips/${tripId}`,
  PATCH_TRIP: (tripId: string) => `/trips/${tripId}`,
};

export const USERS = {
  GET_PROFILE: "/users/profile",
};

export const ITINERARY_ITEMS = {
  ADD_ITEM: "/itinerary-items",
  DELETE_ITEM: (itemId: number) => `/itinerary-items/${itemId}`,
  UPDATE_ITEM: (itemId: number) => `/itinerary-items/${itemId}`,
  GET_ITEMS: "/itinerary-items",
};

export const PLACES = {
  SEARCH_PLACES: "/places/search",
  SEARCH_PLACES_NEARBY: "/places/search-nearby",
  GET_DETAILS_BY_NAVER_PLACE_ID: (naverPlaceId: string) => `/places/naver/${naverPlaceId}`,
  GET_ALL: "/places",
  CREATE: "/places",
  GET_BY_ID: (placeId: number) => `/places/${placeId}`,
  DELETE_BY_ID: (placeId: number) => `/places/${placeId}`,
  UPDATE_BY_ID: (placeId: number) => `/places/${placeId}`,
};

export const MAPS = {
  GEOCODE: "/maps/geocode",
  REVERSE_GEOCODE: "/maps/reverse-geocode",
  DIRECTIONS: "/maps/directions",
  DIRECTIONS_WAYPOINTS: "/maps/directions-waypoints",
};

export const FAVORITES = {
  ADD_FAVORITE: "/favorites",
  REMOVE_FAVORITE: (placeId: number) => `/favorites/${placeId}`,
  GET_FAVORITES: "/favorites",
};
