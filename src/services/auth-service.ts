import { AUTH } from "@/utils/constants";
import apiClient from "./api";

interface GoogleAuthUrlResponse {
  url: string;
}

class AuthService {
  async getGoogleAuthUrl(): Promise<GoogleAuthUrlResponse> {
    try {
      const { data } = await apiClient.get<GoogleAuthUrlResponse>(AUTH.GET_GOOGLE_AUTH_URL);
      return data;
    } catch (error) {
      console.error("Failed to get Google auth URL:", error);
      throw new Error("Unable to initialize Google authentication");
    }
  }

  // async handleGoogleCallback(code: string): Promise<UserProfile> {
  //   try {
  //     const { data } = await apiClient.post<GoogleCallbackResponse>(AUTH.GOOGLE_CALLBACK, { code });
  //     return data;
  //   } catch (error) {
  //     console.error("Google callback failed:", error);
  //     throw new Error("Authentication failed. Please try again.");
  //   }
  // }
}

export const authService = new AuthService();
