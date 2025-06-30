import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { goalsAPI } from "../../services/api";

interface Goal {
  id: string;
  title: string;
  content: string;
  targetDate: string;
  status: "start" | "completed";
  createdAt: string;
  updatedAt: string;
}

interface GoalsState {
  goals: Goal[];
  isLoading: boolean;
  error: string | null;
}

const initialState: GoalsState = {
  goals: [],
  isLoading: false,
  error: null,
};

// Fetch all goals
export const fetchGoals = createAsyncThunk("goals/fetchGoals", async () => {
  const response = await goalsAPI.getGoals();
  return response;
});

// Create a new goal
export const createGoal = createAsyncThunk(
  "goals/createGoal",
  async (goalData: {
    title: string;
    content: string;
    targetDate: string;
    status: "start" | "completed";
  }) => {
    const response = await goalsAPI.createGoal(goalData);
    return response;
  }
);

// Update entire goal (for editing)
export const updateGoal = createAsyncThunk(
  "goals/updateGoal",
  async ({
    id,
    updates,
  }: {
    id: string;
    updates: {
      title?: string;
      content?: string;
      targetDate?: string;
      status?: "start" | "completed";
    };
  }) => {
    const response = await goalsAPI.updateGoal(id, updates);
    return response;
  }
);

// Update status only (drag & drop)
export const updateGoalStatus = createAsyncThunk(
  "goals/updateGoalStatus",
  async ({ id, status }: { id: string; status: "start" | "completed" }) => {
    const response = await goalsAPI.updateGoal(id, { status });
    return response;
  }
);

// Delete a goal
export const deleteGoal = createAsyncThunk(
  "goals/deleteGoal",
  async (id: string) => {
    await goalsAPI.deleteGoal(id);
    return id;
  }
);

const goalsSlice = createSlice({
  name: "goals",
  initialState,
  reducers: {
    // Optimistic update for drag-drop
    moveGoal: (
      state,
      action: PayloadAction<{
        goalId: string;
        newStatus: "start" | "completed";
      }>
    ) => {
      const goal = state.goals.find((g) => g.id === action.payload.goalId);
      if (goal) {
        goal.status = action.payload.newStatus;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH GOALS
      .addCase(fetchGoals.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        console.log("Action -->>", action.payload);
        state.goals = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to load goals.";
      })

      // CREATE GOAL
      .addCase(createGoal.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createGoal.fulfilled, (state, action) => {
        state.goals.push(action.payload);
        state.isLoading = false;
      })
      .addCase(createGoal.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to create goal.";
      })

      // UPDATE GOAL (full)
      .addCase(updateGoal.fulfilled, (state, action) => {
        const index = state.goals.findIndex((g) => g.id === action.payload.id);
        if (index !== -1) {
          state.goals[index] = action.payload;
        }
      })

      // UPDATE GOAL STATUS (from drag)
      .addCase(updateGoalStatus.fulfilled, (state, action) => {
        const index = state.goals.findIndex((g) => g.id === action.payload.id);
        if (index !== -1) {
          state.goals[index] = action.payload;
        }
      })

      // DELETE GOAL
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.goals = state.goals.filter((g) => g.id !== action.payload);
      });
  },
});

export const { moveGoal } = goalsSlice.actions;
export default goalsSlice.reducer;
