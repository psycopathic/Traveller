import axios from "axios";
import { getStoredAuthToken } from "./tokenStorage";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getStoredAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getApiErrorMessage = (error) => {
  const status = error?.response?.status;
  const method = error?.config?.method?.toUpperCase() || "REQUEST";
  const baseURL = error?.config?.baseURL || import.meta.env.VITE_API_BASE_URL || "(missing VITE_API_BASE_URL)";
  const path = error?.config?.url || "(unknown path)";
  const requestUrl = `${baseURL}${path}`;
  const apiMessage = error?.response?.data?.message || error?.response?.data?.error;

  if (!error?.response) {
    return [
      "Network error: could not reach backend.",
      `Request: ${method} ${requestUrl}`,
      "Checks:",
      "- Is backend server running?",
      "- Is VITE_API_BASE_URL correct in frontend .env?",
      "- Are CORS settings allowing this frontend origin?",
    ].join("\n");
  }

  if (status === 404) {
    return [
      "Endpoint not found (404).",
      `Request: ${method} ${requestUrl}`,
      "Checks:",
      "- Verify VITE_API_BASE_URL points to the correct backend host/port.",
      "- Verify route exists on backend (example: /users/login).",
      "- Verify backend is running in the same environment as frontend.",
      apiMessage ? `Backend message: ${apiMessage}` : null,
    ]
      .filter(Boolean)
      .join("\n");
  }

  if (status === 400 || status === 401) {
    return [
      status === 400 ? "Bad request (400)." : "Unauthorized (401).",
      `Request: ${method} ${requestUrl}`,
      apiMessage || "Please check credentials and request payload.",
    ].join("\n");
  }

  if (status >= 500) {
    return [
      `Server error (${status}).`,
      `Request: ${method} ${requestUrl}`,
      apiMessage || "Backend failed while processing the request.",
      "Check backend logs for the stack trace.",
    ].join("\n");
  }

  return [
    apiMessage || error?.message || "Something went wrong. Please try again.",
    `Request: ${method} ${requestUrl}`,
  ].join("\n");
};

export default api;
