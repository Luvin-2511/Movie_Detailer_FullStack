import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getMeAPI, loginAPI, registerAPI, logoutAPI } from "../../Features/Auth/services/auth.api";

// ── Async thunks ──────────────────────────────────────────────

export const restoreSession = createAsyncThunk("auth/restoreSession", async (_, { rejectWithValue }) => {
  try {
    const res = await getMeAPI();
    return res.data.user;
  } catch {
    return rejectWithValue(null);
  }
});

export const loginUser = createAsyncThunk("auth/login", async (formData, { rejectWithValue }) => {
  try {
    const res = await loginAPI(formData);
    return res.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Login failed.");
  }
});

export const registerUser = createAsyncThunk("auth/register", async (formData, { rejectWithValue }) => {
  try {
    const res = await registerAPI(formData);
    return res.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Registration failed.");
  }
});

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  try { await logoutAPI(); } catch { /* silent */ }
});

// ── Slice ─────────────────────────────────────────────────────
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user:    null,
    loading: true,  // true on mount while session restores
    error:   "",
  },
  reducers: {
    clearAuthError: (state) => { state.error = ""; },
  },
  extraReducers: (builder) => {
    // Restore session
    builder
      .addCase(restoreSession.pending,   (state) => { state.loading = true; })
      .addCase(restoreSession.fulfilled, (state, action) => { state.user = action.payload; state.loading = false; })
      .addCase(restoreSession.rejected,  (state) => { state.user = null; state.loading = false; });

    // Login
    builder
      .addCase(loginUser.pending,   (state) => { state.loading = true;  state.error = ""; })
      .addCase(loginUser.fulfilled, (state, action) => { state.user = action.payload; state.loading = false; })
      .addCase(loginUser.rejected,  (state, action) => { state.error = action.payload; state.loading = false; });

    // Register
    builder
      .addCase(registerUser.pending,   (state) => { state.loading = true;  state.error = ""; })
      .addCase(registerUser.fulfilled, (state, action) => { state.user = action.payload; state.loading = false; })
      .addCase(registerUser.rejected,  (state, action) => { state.error = action.payload; state.loading = false; });

    // Logout
    builder
      .addCase(logoutUser.fulfilled, (state) => { state.user = null; state.loading = false; });
  },
});

export const { clearAuthError } = authSlice.actions;

// ── Selectors ─────────────────────────────────────────────────
export const selectUser            = (state) => state.auth.user;
export const selectAuthLoading     = (state) => state.auth.loading;
export const selectAuthError       = (state) => state.auth.error;
export const selectIsAuthenticated = (state) => !!state.auth.user;
export const selectIsAdmin         = (state) => state.auth.user?.role === "admin";

export default authSlice.reducer;