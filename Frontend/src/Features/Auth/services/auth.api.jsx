import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // send cookies automatically
});

export const registerAPI = (data) => API.post("/auth/register", data);
export const loginAPI = (data) => API.post("/auth/login", data);
export const logoutAPI = () => API.post("/auth/logout");
export const getMeAPI = () => API.get("/auth/me");