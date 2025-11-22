import { create } from "zustand";
export interface PlaceComponent {
  name: string;
  category: string;
  address: string;
  road_address: string;
  latitude: number;
  longitude: number;
  rating: number;
  phone: string;
  naver_link: string;
  description: string;
  business_hours: null;
}

interface TripPlanningComponent {
  name: string;
  category: string;
  address: string;
  road_address: string;
  latitude: number;
  longitude: number;
  phone: string;
  naver_link: string;
  description: string;
  business_hours: null;
  rating: number;
  activity_type: string;
  day: number;
  start_time: string;
  end_time: string;
}

interface ChatComponentState {
  type: "places_list" | "planning" | "timeline" | null;
  components: PlaceComponent[] | null;
  next_suggestions: string[] | null;
  setComponents: (components: PlaceComponent[]) => void;
  setNextSuggestions: (suggestions: string[]) => void;
  setType: (type: "places_list" | "planning" | "timeline" | null) => void;
  currentPlanning: TripPlanningComponent[] | null;
  setCurrentPlanning: (planning: TripPlanningComponent[]) => void;
  reset: () => void;
}

export const useChatComponent = create<ChatComponentState>((set) => ({
  components: [],
  next_suggestions: [],
  type: null,
  setComponents: (components: PlaceComponent[]) => set({ components }),
  setType: (type: "places_list" | "planning" | "timeline" | null) => set({ type }),
  setNextSuggestions: (suggestions: string[]) => set({ next_suggestions: suggestions }),
  currentPlanning: null,
  setCurrentPlanning: (planning: TripPlanningComponent[]) => set({ currentPlanning: planning }),
  reset: () => set({ components: [], next_suggestions: [], type: null, currentPlanning: null }),
}));
