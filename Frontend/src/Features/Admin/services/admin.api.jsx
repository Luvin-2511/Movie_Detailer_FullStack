import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

// ── Stats ─────────────────────────────────────────────────────
export const getStatsAPI       = ()        => API.get("/admin/stats");

// ── Users ─────────────────────────────────────────────────────
export const getAllUsersAPI     = ()        => API.get("/admin/users");
export const getUserByIdAPI     = (id)      => API.get(`/admin/users/${id}`);
export const banUserAPI         = (id)      => API.put(`/admin/users/${id}/ban`);
export const unbanUserAPI       = (id)      => API.put(`/admin/users/${id}/unban`);
export const deleteUserAPI      = (id)      => API.delete(`/admin/users/${id}`);

// ── Movies ────────────────────────────────────────────────────
export const getAllMoviesAdminAPI = ()       => API.get("/movies");
export const addMovieAPI          = (data)   => API.post("/movies", data);
export const updateMovieAPI       = (id, data) => API.put(`/movies/${id}`, data);
export const deleteMovieAdminAPI  = (id)    => API.delete(`/movies/${id}`);