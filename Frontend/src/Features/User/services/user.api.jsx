import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

// ── Favorites ─────────────────────────────────────────────────
export const getFavoritesAPI    = ()         => API.get("/user/favorites");
export const addFavoriteAPI     = (data)     => API.post("/user/favorites", data);
export const removeFavoriteAPI  = (movieId)  => API.delete(`/user/favorites/${movieId}`);

// ── Watchlist ─────────────────────────────────────────────────
export const getWatchlistAPI    = ()         => API.get("/user/watchlist");
export const addWatchlistAPI    = (data)     => API.post("/user/watchlist", data);
export const removeWatchlistAPI = (movieId)  => API.delete(`/user/watchlist/${movieId}`);

// ── Watch History ─────────────────────────────────────────────
export const getHistoryAPI      = ()         => API.get("/user/history");
export const addToHistoryAPI    = (data)     => API.post("/user/history", data);
export const clearHistoryAPI    = ()         => API.delete("/user/history");