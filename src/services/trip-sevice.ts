import { TRIPS } from "@/utils/constants";
import apiClient from "./api";

export interface CreateTripDTO {
  title: string;
  destination_country: string;
  destination_city: string;
  start_date: string;
  end_date: string;
  status: "planning" | "ongoing" | "completed";
  is_group: boolean;
  progress: string;
}

class TripService {
  async createTrip(values: CreateTripDTO): Promise<any> {
    try {
      const { data } = await apiClient.post(TRIPS.CREATE_TRIP, values);
      return data;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to create trip");
    }
  }

  async getTrips(): Promise<any> {
    try {
      const { data } = await apiClient.get<any>(TRIPS.GET_TRIPS);
      return data;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch trips");
    }
  }

  async getTripDetails(tripId: string): Promise<any> {
    try {
      const { data } = await apiClient.get<any>(TRIPS.GET_TRIP_DETAILS(tripId));
      return data;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch trip details");
    }
  }

  async deleteTrip(tripId: string): Promise<void> {
    try {
      await apiClient.delete(TRIPS.DELETE_TRIP(tripId));
    } catch (error) {
      console.error(error);
      throw new Error("Failed to delete trip");
    }
  }

  async updateTrip(tripId: string, values: Partial<CreateTripDTO>): Promise<any> {
    try {
      const { data } = await apiClient.patch<any>(TRIPS.PATCH_TRIP(tripId), values);
      return data;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to update trip");
    }
  }
}

export const tripService = new TripService();
