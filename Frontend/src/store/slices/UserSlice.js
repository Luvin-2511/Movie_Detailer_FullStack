import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getFavoritesAPI, addFavoriteAPI, removeFavoriteAPI,
  getWatchlistAPI, addWatchlistAPI, removeWatchlistAPI,
  getHistoryAPI, addToHistoryAPI, clearHistoryAPI,
} from "../../Features/User/services/user.api";

// ── Favorites thunks ──────────────────────────────────────────
export const fetchFavorites = createAsyncThunk("user/fetchFavorites", async (_, { rejectWithValue }) => {
  try {
    const res = await getFavoritesAPI();
    return res.data.favorites || [];
  } catch { return rejectWithValue([]); }
});

export const addFavorite = createAsyncThunk("user/addFavorite", async (movie, { rejectWithValue }) => {
  try {
    await addFavoriteAPI(movie);
    return movie;
  } catch (err) { return rejectWithValue(movie.movieId); }
});

export const removeFavorite = createAsyncThunk("user/removeFavorite", async (movieId, { rejectWithValue }) => {
  try {
    await removeFavoriteAPI(movieId);
    return movieId;
  } catch (err) { return rejectWithValue(movieId); }
});

// ── Watchlist thunks ──────────────────────────────────────────
export const fetchWatchlist = createAsyncThunk("user/fetchWatchlist", async (_, { rejectWithValue }) => {
  try {
    const res = await getWatchlistAPI();
    return res.data.watchlist || [];
  } catch { return rejectWithValue([]); }
});

export const addWatchlist = createAsyncThunk("user/addWatchlist", async (movie, { rejectWithValue }) => {
  try {
    await addWatchlistAPI(movie);
    return movie;
  } catch (err) { return rejectWithValue(movie.movieId); }
});

export const removeWatchlist = createAsyncThunk("user/removeWatchlist", async (movieId, { rejectWithValue }) => {
  try {
    await removeWatchlistAPI(movieId);
    return movieId;
  } catch (err) { return rejectWithValue(movieId); }
});

// ── History thunks ────────────────────────────────────────────
export const fetchHistory = createAsyncThunk("user/fetchHistory", async (_, { rejectWithValue }) => {
  try {
    const res = await getHistoryAPI();
    return res.data.history || [];
  } catch { return rejectWithValue([]); }
});

export const addToHistory = createAsyncThunk("user/addToHistory", async (movie, { rejectWithValue }) => {
  try {
    await addToHistoryAPI(movie);
    return movie;
  } catch { return movie; } // silent fail — non-critical
});

export const clearHistory = createAsyncThunk("user/clearHistory", async (_, { rejectWithValue }) => {
  try {
    await clearHistoryAPI();
    return true;
  } catch (err) { return rejectWithValue(false); }
});

// ── Slice ─────────────────────────────────────────────────────
const userSlice = createSlice({
  name: "user",
  initialState: {
    favorites:        [],
    watchlist:        [],
    history:          [],
    favLoading:       false,
    watchLoading:     false,
    histLoading:      false,
    favError:         "",
    watchError:       "",
    histError:        "",
  },
  reducers: {
    clearUserData: (state) => {
      state.favorites  = [];
      state.watchlist  = [];
      state.history    = [];
    },
  },
  extraReducers: (builder) => {
    // Favorites
    builder
      .addCase(fetchFavorites.pending,   (state) => { state.favLoading = true; })
      .addCase(fetchFavorites.fulfilled, (state, action) => { state.favorites = action.payload; state.favLoading = false; })
      .addCase(fetchFavorites.rejected,  (state) => { state.favLoading = false; });

    builder
      .addCase(addFavorite.pending, (state, action) => {
        // Optimistic
        const movie = action.meta.arg;
        if (!state.favorites.find((f) => f.movieId === movie.movieId))
          state.favorites.unshift(movie);
      })
      .addCase(addFavorite.rejected, (state, action) => {
        // Rollback
        state.favorites = state.favorites.filter((f) => f.movieId !== action.payload);
      });

    builder
      .addCase(removeFavorite.pending, (state, action) => {
        // Optimistic
        state.favorites = state.favorites.filter((f) => f.movieId !== action.meta.arg);
      })
      .addCase(removeFavorite.rejected, (state) => {
        // Could re-fetch here; keeping simple
      });

    // Watchlist
    builder
      .addCase(fetchWatchlist.pending,   (state) => { state.watchLoading = true; })
      .addCase(fetchWatchlist.fulfilled, (state, action) => { state.watchlist = action.payload; state.watchLoading = false; })
      .addCase(fetchWatchlist.rejected,  (state) => { state.watchLoading = false; });

    builder
      .addCase(addWatchlist.pending, (state, action) => {
        const movie = action.meta.arg;
        if (!state.watchlist.find((w) => w.movieId === movie.movieId))
          state.watchlist.unshift(movie);
      })
      .addCase(addWatchlist.rejected, (state, action) => {
        state.watchlist = state.watchlist.filter((w) => w.movieId !== action.payload);
      });

    builder
      .addCase(removeWatchlist.pending, (state, action) => {
        state.watchlist = state.watchlist.filter((w) => w.movieId !== action.meta.arg);
      });

    // History
    builder
      .addCase(fetchHistory.pending,   (state) => { state.histLoading = true; })
      .addCase(fetchHistory.fulfilled, (state, action) => { state.history = action.payload; state.histLoading = false; })
      .addCase(fetchHistory.rejected,  (state) => { state.histLoading = false; });

    builder
      .addCase(addToHistory.pending, (state, action) => {
        // Optimistic — move to top, dedup
        const movie = action.meta.arg;
        state.history = [movie, ...state.history.filter((h) => h.movieId !== movie.movieId)];
      });

    builder
      .addCase(clearHistory.pending,   (state) => { state.history = []; })
      .addCase(clearHistory.rejected,  (state, action) => {
        // Rollback not easily possible here without snapshot — just keep empty
      });
  },
});

export const { clearUserData } = userSlice.actions;

// ── Selectors ─────────────────────────────────────────────────
export const selectFavorites    = (state) => state.user.favorites;
export const selectWatchlist    = (state) => state.user.watchlist;
export const selectHistory      = (state) => state.user.history;
export const selectFavLoading   = (state) => state.user.favLoading;
export const selectWatchLoading = (state) => state.user.watchLoading;
export const selectHistLoading  = (state) => state.user.histLoading;
export const selectFavError     = (state) => state.user.favError;
export const selectWatchError   = (state) => state.user.watchError;
export const selectHistError    = (state) => state.user.histError;
export const selectIsFavorited  = (movieId) => (state) =>
  state.user.favorites.some((f) => f.movieId === String(movieId));
export const selectIsWatchlisted = (movieId) => (state) =>
  state.user.watchlist.some((w) => w.movieId === String(movieId));

export default userSlice.reducer;