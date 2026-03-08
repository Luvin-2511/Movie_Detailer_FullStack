import { configureStore } from "@reduxjs/toolkit";
import authReducer   from "./slices/AuthSlice";
import moviesReducer from "./slices/MovieSlice";
import userReducer   from "./slices/UserSlice";
import adminReducer  from "./slices/AdminSlice";

const store = configureStore({
  reducer: {
    auth:   authReducer,
    movies: moviesReducer,
    user:   userReducer,
    admin:  adminReducer,
  },
});

export default store;