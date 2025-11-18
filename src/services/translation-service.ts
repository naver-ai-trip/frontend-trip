 

import apiClient from "./api";

export interface TextTranslationRequest {
  text: string;
  source_language: string;
  target_language: string;
}

export interface TranslationResponse {
  translated_text: string;
  source_language: string;
  target_language: string;
  confidence?: number;
}

export interface Translation {
  id: number;
  user_id: number;
  type: "text" | "image" | "speech";
  source_text: string;
  translated_text: string;
  source_language: string;
  target_language: string;
  created_at: string;
  updated_at: string;
}

class TranslationService {
  // Text translation
  async translateText(data: TextTranslationRequest): Promise<TranslationResponse> {
    const response = await apiClient.post("/translations/text", data);
    return response.data;
  }

  // Image translation
  async translateImage(
    imageFile: File,
    targetLanguage: string,
    sourceLanguage?: string,
  ): Promise<TranslationResponse> {
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("target_language", targetLanguage);
    if (sourceLanguage) formData.append("source_language", sourceLanguage);

    const response = await apiClient.post("/translations/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  // Speech translation
  async translateSpeech(audioFile: File, targetLanguage: string): Promise<TranslationResponse> {
    const formData = new FormData();
    formData.append("audio", audioFile);
    formData.append("target_language", targetLanguage);

    const response = await apiClient.post("/translations/speech", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  // Get translation history
  async getTranslations(): Promise<any> {
    const response = await apiClient.get("/translations");
    return response.data;
  }
}

export const translationService = new TranslationService();
