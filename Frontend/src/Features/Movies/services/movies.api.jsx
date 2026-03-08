import axios from "axios";

const TMDB_BASE = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const tmdb = axios.create({
  baseURL: TMDB_BASE,
  params: { api_key: API_KEY },
});

// ── Trending ──────────────────────────────────────────────────
export const fetchTrendingAPI    = (page = 1) => tmdb.get(`/trending/all/day`, { params: { page } });

// ── Popular ───────────────────────────────────────────────────
export const fetchPopularMoviesAPI = (page = 1) => tmdb.get(`/movie/popular`, { params: { page } });
export const fetchPopularTVAPI     = (page = 1) => tmdb.get(`/tv/popular`,    { params: { page } });

// ── Top Rated ─────────────────────────────────────────────────
// ── Top Rated ─────────────────────────────────────────────────
export const fetchTopRatedAPI    = (page = 1) => tmdb.get(`/movie/top_rated`, { params: { page } });

// ── Discover (Genres) ─────────────────────────────────────────
export const discoverMoviesAPI   = (genreId, page = 1) => tmdb.get(`/discover/movie`, { params: { with_genres: genreId, page } });
export const discoverTVAPI       = (genreId, page = 1) => tmdb.get(`/discover/tv`,    { params: { with_genres: genreId, page } });

// ── Search ────────────────────────────────────────────────────
export const searchMultiAPI      = (query, page = 1) => tmdb.get(`/search/multi`, { params: { query, page } });

// ── Movie Detail ──────────────────────────────────────────────
export const fetchMovieDetailAPI = (id)   => tmdb.get(`/movie/${id}`);
export const fetchTVDetailAPI    = (id)   => tmdb.get(`/tv/${id}`);
export const fetchMovieVideosAPI = (id)   => tmdb.get(`/movie/${id}/videos`);
export const fetchTVVideosAPI    = (id)   => tmdb.get(`/tv/${id}/videos`);
export const fetchMovieCreditsAPI = (id)  => tmdb.get(`/movie/${id}/credits`);
export const fetchSimilarAPI     = (id, type = "movie") => tmdb.get(`/${type}/${id}/similar`);

// ── Person Detail ─────────────────────────────────────────────
export const fetchPersonDetailAPI = (id)  => tmdb.get(`/person/${id}`);
export const fetchPersonCreditsAPI = (id) => tmdb.get(`/person/${id}/combined_credits`);

// ── Genres ────────────────────────────────────────────────────
export const fetchGenresAPI      = () => tmdb.get(`/genre/movie/list`);