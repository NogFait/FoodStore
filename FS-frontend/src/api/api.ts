import axios from "axios";
const urlApi = import.meta.env.VITE_API_URL;

export const API_BASE = urlApi ;

const api = axios.create({
  baseURL: urlApi,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default api;
