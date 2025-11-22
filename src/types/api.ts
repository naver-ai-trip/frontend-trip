export interface PlaceMessageRes {
  name: string;
  category: string;
  address: string;
  road_address: string;
  latitude: number;
  longitude: number;
  phone: string;
  naver_link: string;
  description: string;
  business_hours: string | null;
  rating: number;
  activity_type: string; // "attraction" | "restaurant" | ...
  meal_type?: string; // optional (chỉ có khi restaurant)
  day: number;
  start_time: string;
  end_time: string;
}

export interface PlacesListComponent {
  type: "places_list";
  data: {
    places: PlaceMessageRes[];
  };
}

export type ChatComponent = PlacesListComponent;

export interface ChatContentResponseData {
  message: string;
  components: ChatComponent[];
  actions_taken: string[];
  next_suggestions: string[];
}
