import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { dashboardAPI } from "../../services/api";

interface DashboardItem {
  _id: string;
  userId: string;
  title?: string;
  content?: string;
  type?: string;
  priority?: string;
  status?: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

interface DashboardCounts {
  blogs: number;
  todos: number;
  notes: number;
  goals: number;
  incompleteTodos: number;
  startedGoals: number;
}

interface DashboardState {
  items: DashboardItem[];
  counts: DashboardCounts | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  items: [],
  counts: null,
  isLoading: false,
  error: null,
};

export const fetchDashboardItems = createAsyncThunk(
  "dashboard/fetchDashboardItems",
  async (_, { rejectWithValue }) => {
    try {
      const res = await dashboardAPI.getDashbaord();
      return res;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch dashboard data"
      );
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardItems.fulfilled, (state, action) => {
        console.log("Action -->>", action);
        state.isLoading = false;
        state.items = action.payload?.latest;
        state.counts = action.payload?.counts;
      })
      .addCase(fetchDashboardItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default dashboardSlice.reducer;
