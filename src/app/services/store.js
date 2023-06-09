import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./auth/authService";
import authReducer from "../../features/auth/authSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

export default store;
