import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { authAPI } from "../../services/api";

// 🌐 Token from localStorage on initial load
const tokenFromStorage = localStorage.getItem("token");

interface User {
  id: string;
  name: string;
  email: string;
  gender?: string;
  dob?: string;
  avatar: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  initialCheckDone: boolean;
  message: string | null;
}

const initialState: AuthState = {
  user: null,
  token: tokenFromStorage,
  isLoading: false,
  isAuthenticated: !!tokenFromStorage,
  error: null,
  initialCheckDone: false,
  message: null,
};

// ✅ LOGIN
export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const loginRes = await authAPI.login(credentials);
      const token = loginRes.token;

      if (token) {
        localStorage.setItem("token", token);
      }

      const meRes = await authAPI.getMe();
      return { user: meRes.user, token: token, message: loginRes.message };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

// ✅ REGISTER
export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    userData: {
      name: string;
      email: string;
      password: string;
      gender: string;
      dob: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const registerRes = await authAPI.register(userData);
      const token = registerRes.token;

      if (token) {
        localStorage.setItem("token", token);
      }

      const meRes = await authAPI.getMe();
      return { user: meRes.user, token };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Registration failed"
      );
    }
  }
);

// ✅ LOGOUT
export const logoutUser = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("token");
});

// ✅ FETCH CURRENT USER (on app load or refresh)
export const fetchCurrentUser = createAsyncThunk<User>(
  "auth/getMe",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getMe();
      return response.user;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Not authenticated"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.message = action.payload.message;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })

      // LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      })

      // FETCH CURRENT USER
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        fetchCurrentUser.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.user = action.payload;
          state.isAuthenticated = true;
          state.isLoading = false;
          state.initialCheckDone = true;
        }
      )
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.initialCheckDone = true;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
