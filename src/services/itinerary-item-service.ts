import { ITINERARY_ITEMS } from "@/utils/constants";
import apiClient from "./api";
import qs from "query-string";

export interface ItineraryItemDTO {
  trip_id: number;
  title: string;
  day_number: number;
  start_time: string;
  end_time: string;
  place_id: number;
  description: string;
}

export interface ItineraryItemParams {
  trip_id?: number;
  day_number?: number;
  page?: number;
  per_page?: number;
}

class ItineraryItemService {
  async addItineraryItem(values: ItineraryItemDTO): Promise<any> {
    const { data } = await apiClient.post(ITINERARY_ITEMS.ADD_ITEM, values);
    return data;
  }

  async deleteItineraryItem(itemId: number): Promise<void> {
    await apiClient.delete(ITINERARY_ITEMS.DELETE_ITEM(itemId));
  }

  async updateItineraryItem(itemId: number, values: Partial<ItineraryItemDTO>): Promise<any> {
    const { data } = await apiClient.patch<any>(ITINERARY_ITEMS.UPDATE_ITEM(itemId), values);
    return data;
  }

  async getItineraryItems(params: ItineraryItemParams): Promise<any> {
    const url = qs.stringifyUrl({
      url: ITINERARY_ITEMS.GET_ITEMS,
      query: {
        ...params,
      },
    });
    const { data } = await apiClient.get<any>(url);
    return data;
  }
}

export const itineraryItemService = new ItineraryItemService();
