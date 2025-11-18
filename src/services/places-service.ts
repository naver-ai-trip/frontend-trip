import queryString from "query-string";
import apiClient from "./api";
import { PLACES } from "@/utils/constants";

export interface CreatePlaceDTO {
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  category: string;
}

export interface PlaceRes {
  data: any[];
  links: Links;
  meta: Meta;
}

interface Meta {
  current_page: number;
  from: number;
  last_page: number;
  links: Link[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

interface Link {
  url: null | string;
  label: string;
  page: null | number;
  active: boolean;
}

interface Links {
  first: string;
  last: string;
  prev: null;
  next: null;
}

export interface PlaceDatum {
  id: number;
  name: string;
  category: string;
  address: string;
  road_address: string;
  latitude: number;
  longitude: number;
  naver_link: string;
  average_rating: null;
  review_count: number;
  created_at: string;
  updated_at: string;
}

export class PlacesService {
  async searchPlaces(query: string): Promise<any> {
    const response = await apiClient.post("/places/search", { query });
    return response.data;
  }

  async searchPlacesNearby(
    latitude: number,
    longitude: number,
    query: string = "restaurant",
    radius: number,
  ): Promise<any[]> {
    const params = { latitude, longitude, radius, query };
    const response = await apiClient.get("/places/search-nearby", { params });
    return response.data;
  }

  async getDetailsByNaverPlaceId(naverPlaceId: string): Promise<any> {
    const response = await apiClient.get(`/places/naver/${naverPlaceId}`);
    return response.data;
  }

  async createPlace(data: CreatePlaceDTO): Promise<any> {
    const response = await apiClient.post(PLACES.CREATE, data);
    return response.data;
  }

  async getPlaces(page: number, per_page: number): Promise<PlaceRes> {
    const url = queryString.stringifyUrl({
      url: PLACES.GET_ALL,
      query: { page, per_page },
    });
    const response = await apiClient.get(url);
    return response.data;
  }
}

export const placesService = new PlacesService();
