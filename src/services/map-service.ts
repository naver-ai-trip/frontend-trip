import { MAPS } from "@/utils/constants";
import queryString from "query-string";
import apiClient from "./api";

export interface DirectionsDTO {
  start_lat: number;
  start_lng: number;
  goal_lat: number;
  goal_lng: number;
  option: string;
}

interface DirectionsWaypointsDTO {
  start_lat: number;
  start_lng: number;
  goal_lat: number;
  goal_lng: number;
  waypoints: Waypoint[];
  option: string;
}

interface Waypoint {
  lat: number;
  lng: number;
}

class MapService {
  async geocode(query: string): Promise<any> {
    const url = queryString.stringifyUrl({
      url: MAPS.GEOCODE,
    });
    const res = await apiClient.post(url, { query });
    return res.data;
  }

  async reverseGeocode(latitude: number, longitude: number): Promise<any> {
    const url = queryString.stringifyUrl({
      url: MAPS.REVERSE_GEOCODE,
    });
    const res = await apiClient.post(url, { latitude, longitude });
    return res.data;
  }

  async getDirections(data: DirectionsDTO): Promise<any> {
    const url = queryString.stringifyUrl({
      url: MAPS.DIRECTIONS,
    });
    const res = await apiClient.post(url, data);
    return res.data;
  }

  async getDirectionsWithWaypoints(data: DirectionsWaypointsDTO): Promise<any> {
    const url = queryString.stringifyUrl({
      url: MAPS.DIRECTIONS_WAYPOINTS,
    });
    const res = await apiClient.post(url, data);
    return res.data;
  }
}

export const mapService = new MapService();
