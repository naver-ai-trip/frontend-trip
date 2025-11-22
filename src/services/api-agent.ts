import axios from "axios";

const apiAgentClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_AGENT_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 100000,
});

export default apiAgentClient;
