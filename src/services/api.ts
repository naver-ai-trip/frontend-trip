import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer 1|XhXYyGossrCNGHdB60vuLWPYwSbSO1RRcYHVFaAXd5a178cb`,
  },
  timeout: 15000,
});

export default apiClient;
