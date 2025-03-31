import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_ROUTE,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
