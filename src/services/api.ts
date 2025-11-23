import axios from "axios";

const getToken = () => {
  // Check if localStorage is available (client-side only)
  if (typeof window !== "undefined" && window.localStorage) {
    return localStorage.getItem("token") || "1|XhXYyGossrCNGHdB60vuLWPYwSbSO1RRcYHVFaAXd5a178cb";
  }
  // Fallback token for server-side rendering
  return "1|XhXYyGossrCNGHdB60vuLWPYwSbSO1RRcYHVFaAXd5a178cb";
};

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  },
  timeout: 30000,
});

export default apiClient;
