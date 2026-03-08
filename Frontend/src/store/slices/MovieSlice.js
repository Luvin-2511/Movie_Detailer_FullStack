import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchTrendingAPI, fetchPopularMoviesAPI, fetchPopularTVAPI,
  fetchTopRatedAPI, searchMultiAPI,
} from "../../Features/Movies/services/movies.api";

// ── Async thunk ───────────────────────────────────────────────
export const fetchMovies = createAsyncThunk(
  "movies/fetch",
  async ({ category, searchQuery, page }, { rejectWithValue }) => {
    try {
      let res;
      if (searchQuery?.trim()) {
        res = await searchMultiAPI(searchQuery.trim(), page);
      } else {
        switch (category) {
          case "movies":   res = await fetchPopularMoviesAPI(page); break;
          case "tv":       res = await fetchPopularTVAPI(page);     break;
          case "toprated": res = await fetchTopRatedAPI(page);      break;
          default:         res = await fetchTrendingAPI(page);      break;
        }
      }
      const results = (res.data.results || []).filter(
        (item) => item.media_type !== "person" && (item.poster_path || item.backdrop_path)
      );
      return { results, totalPages: res.data.total_pages || 1, page };
    } catch (err) {
      return rejectWithValue("Failed to load movies.");
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────
const moviesSlice = createSlice({
  name: "movies",
  initialState: {
    items:          [],
    page:           1,
    totalPages:     1,
    hasMore:        true,
    loading:        false,
    error:          "",
    activeCategory: "trending",
    searchQuery:    "",
  },
  reducers: {
    setActiveCategory: (state, action) => {
      state.activeCategory = action.payload;
      state.searchQuery    = "";
      state.items          = [];
      state.page           = 1;
      state.hasMore        = true;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.items       = [];
      state.page        = 1;
      state.hasMore     = true;
    },
    resetMovies: (state) => {
      state.items    = [];
      state.page     = 1;
      state.hasMore  = true;
      state.error    = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error   = "";
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        const { results, totalPages, page } = action.payload;
        state.loading    = false;
        state.items      = page === 1 ? results : [...state.items, ...results];
        state.page       = page;
        state.totalPages = totalPages;
        state.hasMore    = page < totalPages;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      });
  },
});

export const { setActiveCategory, setSearchQuery, resetMovies } = moviesSlice.actions;

// ── Selectors ─────────────────────────────────────────────────
export const selectMovies         = (state) => state.movies.items;
export const selectMoviesLoading  = (state) => state.movies.loading;
export const selectMoviesError    = (state) => state.movies.error;
export const selectHasMore        = (state) => state.movies.hasMore;
export const selectMoviePage      = (state) => state.movies.page;
export const selectActiveCategory = (state) => state.movies.activeCategory;
export const selectSearchQuery    = (state) => state.movies.searchQuery;

export default moviesSlice.reducer;