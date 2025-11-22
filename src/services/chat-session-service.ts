import { CHAT_SESSIONS } from "@/utils/constants";
import apiClient from "./api";
import queryString from "query-string";
import { MessageRequest } from "@/types";
import apiAgentClient from "./api-agent";

export interface CreateSessionRequest {
  session_type: string;
  trip_id: number;
  context: Context;
}

interface Context {
  destination?: string;
  budget?: string;
  interests?: string[];
  travel_dates?: Traveldates;
}

export interface Traveldates {
  start: string;
  end: string;
}

export interface MessageStreamRequest {
  session_id: number;
  message: string;
  auth_token: string;
  trip_id: number;
}

class ChatSessionService {
  async createSession(values: CreateSessionRequest) {
    const { data } = await apiClient.post(CHAT_SESSIONS.ADD_SESSION, values);
    return data;
  }

  async getSession(sessionId: string, includes: string[]) {
    const url = queryString.stringifyUrl({
      url: CHAT_SESSIONS.GET_SESSION(sessionId),
      query: { includes: includes.join(",") },
    });
    return await apiClient.get(url);
  }

  async deleteSession(sessionId: string) {
    return await apiClient.delete(CHAT_SESSIONS.DELETE_SESSION(sessionId));
  }

  async updateSession(sessionId: string, data: any) {
    return await apiClient.patch(CHAT_SESSIONS.UPDATE_SESSION(sessionId), data);
  }

  async activateSession(sessionId: string) {
    return await apiClient.post(CHAT_SESSIONS.ACTIVATE_SESSION(sessionId));
  }

  async getSessions(params: { is_active?: boolean; trip_id?: number }) {
    const url = queryString.stringifyUrl({
      url: CHAT_SESSIONS.GET_SESSIONS,
      query: params,
    });
    return await apiClient.get(url);
  }

  async sendMessage(sessionId: string, values: MessageRequest) {
    const url = queryString.stringifyUrl({
      url: CHAT_SESSIONS.SEND_MESSAGE(sessionId),
    });
    const { data } = await apiClient.post(url, values);
    return data;
  }

  async streamMessage(values: MessageStreamRequest) {
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_AGENT_URL + CHAT_SESSIONS.SEND_MESSAGE_STREAM;
    const url = queryString.stringifyUrl({
      url: BASE_URL,
    });

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.body) {
      throw new Error("No stream body returned");
    }

    return response.body;
  }

  async getMessages(sessionId: string) {
    const url = queryString.stringifyUrl({
      url: CHAT_SESSIONS.GET_MESSAGES(sessionId),
    });
    const { data } = await apiClient.get(url);
    return data;
  }
}

export const chatSessionService = new ChatSessionService();
