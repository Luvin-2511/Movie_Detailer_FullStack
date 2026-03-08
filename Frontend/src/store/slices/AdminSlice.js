import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getStatsAPI, getAllUsersAPI, banUserAPI, unbanUserAPI,
  deleteUserAPI, getAllMoviesAdminAPI, addMovieAPI,
  updateMovieAPI, deleteMovieAdminAPI,
} from "../../Features/Admin/services/admin.api";

// ── Thunks ────────────────────────────────────────────────────
export const fetchStats   = createAsyncThunk("admin/fetchStats",   async (_, { rejectWithValue }) => {
  try { return (await getStatsAPI()).data.stats; } catch { return rejectWithValue(null); }
});

export const fetchAllUsers = createAsyncThunk("admin/fetchUsers",  async (_, { rejectWithValue }) => {
  try { return (await getAllUsersAPI()).data.users || []; } catch { return rejectWithValue([]); }
});

export const banUser    = createAsyncThunk("admin/banUser",    async (id) => { await banUserAPI(id);   return id; });
export const unbanUser  = createAsyncThunk("admin/unbanUser",  async (id) => { await unbanUserAPI(id); return id; });
export const deleteUser = createAsyncThunk("admin/deleteUser", async (id) => { await deleteUserAPI(id); return id; });

export const fetchAllMoviesAdmin = createAsyncThunk("admin/fetchMovies", async (_, { rejectWithValue }) => {
  try { return (await getAllMoviesAdminAPI()).data.movies || []; } catch { return rejectWithValue([]); }
});

export const addMovie = createAsyncThunk("admin/addMovie", async (data, { rejectWithValue }) => {
  try { return (await addMovieAPI(data)).data.movie; } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const updateMovie = createAsyncThunk("admin/updateMovie", async ({ id, data }, { rejectWithValue }) => {
  try { return (await updateMovieAPI(id, data)).data.movie; } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const deleteMovie = createAsyncThunk("admin/deleteMovie", async (id) => { await deleteMovieAdminAPI(id); return id; });

// ── Slice ─────────────────────────────────────────────────────
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    stats:       null,
    users:       [],
    movies:      [],
    activeTab:   "overview",
    loading:     false,
    usersLoading: false,
    moviesLoading: false,
    error:       "",
  },
  reducers: {
    setActiveTab: (state, action) => { state.activeTab = action.payload; },
  },
  extraReducers: (builder) => {
    // Stats
    builder
      .addCase(fetchStats.fulfilled, (state, action) => { state.stats = action.payload; });

    // Users
    builder
      .addCase(fetchAllUsers.pending,   (state) => { state.usersLoading = true; })
      .addCase(fetchAllUsers.fulfilled, (state, action) => { state.users = action.payload; state.usersLoading = false; })
      .addCase(fetchAllUsers.rejected,  (state) => { state.usersLoading = false; });

    builder.addCase(banUser.fulfilled,    (state, action) => {
      const u = state.users.find((u) => u._id === action.payload);
      if (u) u.isBanned = true;
    });
    builder.addCase(unbanUser.fulfilled,  (state, action) => {
      const u = state.users.find((u) => u._id === action.payload);
      if (u) u.isBanned = false;
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.users = state.users.filter((u) => u._id !== action.payload);
    });

    // Movies
    builder
      .addCase(fetchAllMoviesAdmin.pending,   (state) => { state.moviesLoading = true; })
      .addCase(fetchAllMoviesAdmin.fulfilled, (state, action) => { state.movies = action.payload; state.moviesLoading = false; })
      .addCase(fetchAllMoviesAdmin.rejected,  (state) => { state.moviesLoading = false; });

    builder.addCase(addMovie.fulfilled,    (state, action) => { state.movies.unshift(action.payload); });
    builder.addCase(updateMovie.fulfilled, (state, action) => {
      const idx = state.movies.findIndex((m) => m._id === action.payload._id);
      if (idx !== -1) state.movies[idx] = action.payload;
    });
    builder.addCase(deleteMovie.fulfilled, (state, action) => {
      state.movies = state.movies.filter((m) => m._id !== action.payload);
    });
  },
});

export const { setActiveTab } = adminSlice.actions;

// ── Selectors ─────────────────────────────────────────────────
export const selectStats          = (state) => state.admin.stats;
export const selectAdminUsers     = (state) => state.admin.users;
export const selectAdminMovies    = (state) => state.admin.movies;
export const selectActiveTab      = (state) => state.admin.activeTab;
export const selectUsersLoading   = (state) => state.admin.usersLoading;
export const selectMoviesLoading  = (state) => state.admin.moviesLoading;

export default adminSlice.reducer;