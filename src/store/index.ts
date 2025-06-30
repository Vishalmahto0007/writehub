import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import blogSlice from "./slices/blogSlice";
import todoSlice from "./slices/todoSlice";
import notesSlice from "./slices/notesSlice";
import goalsSlice from "./slices/goalsSlice";
import uiSlice from "./slices/uiSlice";
import dashboardReducer from "./slices/dashboardSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    blog: blogSlice,
    todo: todoSlice,
    notes: notesSlice,
    goals: goalsSlice,
    ui: uiSlice,
    dashboard: dashboardReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
