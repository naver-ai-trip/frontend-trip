import { FAVORITES } from "@/utils/constants";
import apiClient from "./api";

interface FavoritesDatum {
  data: Datum[];
  meta: Meta;
}

interface Meta {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

interface Datum {
  id: number;
  user_id: number;
  favoritable_type: string;
  favoritable_id: number;
  created_at: string;
  updated_at: string;
}

export interface FavoritesDTO {
  favoritable_type: string;
  favoritable_id: number;
}

class FavoritesService {
  async getFavorites(): Promise<FavoritesDatum> {
    const response = await apiClient.get(FAVORITES.GET_FAVORITES);
    return response.data.data;
  }

  async addFavorite(favorites: FavoritesDTO): Promise<void> {
    await apiClient.post(FAVORITES.ADD_FAVORITE, { ...favorites });
  }

  async removeFavorite(placeId: number): Promise<void> {
    await apiClient.delete(FAVORITES.REMOVE_FAVORITE(placeId));
  }
}

export const favoritesService = new FavoritesService();
