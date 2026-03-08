import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getFavoritesAPI, addFavoriteAPI, removeFavoriteAPI,
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
    history:          [],
    favLoading:       false,
    histLoading:      false,
    favError:         "",
    histError:        "",
  },
  reducers: {
    clearUserData: (state) => {
      state.favorites  = [];
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
export const selectHistory      = (state) => state.user.history;
export const selectFavLoading   = (state) => state.user.favLoading;
export const selectHistLoading  = (state) => state.user.histLoading;
export const selectFavError     = (state) => state.user.favError;
export const selectHistError    = (state) => state.user.histError;
export const selectIsFavorited  = (movieId) => (state) =>
  state.user.favorites.some((f) => f.movieId === String(movieId));

export default userSlice.reducer;