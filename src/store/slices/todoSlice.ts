import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { todoAPI } from "../../services/api";

interface Todo {
  id: string;
  title: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TodoState {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
  filter: "all" | "open" | "completed";
}

const initialState: TodoState = {
  todos: [],
  isLoading: false,
  error: null,
  filter: "all",
};

export const fetchTodos = createAsyncThunk("todo/fetchTodos", async () => {
  const response = await todoAPI.getTodos();
  return response;
});

export const createTodo = createAsyncThunk(
  "todo/createTodo",
  async (todoData: { title: string; priority: "low" | "medium" | "high" }) => {
    const response = await todoAPI.createTodo(todoData);
    return response;
  }
);

export const updateTodo = createAsyncThunk(
  "todo/updateTodo",
  async ({ id, updates }: { id: string; updates: Partial<Todo> }) => {
    const response = await todoAPI.updateTodo(id, updates);
    return response;
  }
);

export const deleteTodo = createAsyncThunk(
  "todo/deleteTodo",
  async (id: string) => {
    await todoAPI.deleteTodo(id);
    return id;
  }
);

const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<TodoState["filter"]>) => {
      state.filter = action.payload;
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find((t) => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.todos = action.payload;
        state.isLoading = false;
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        state.todos.unshift(action.payload);
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        const index = state.todos.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.todos = state.todos.filter((t) => t.id !== action.payload);
      });
  },
});

export const { setFilter, toggleTodo } = todoSlice.actions;
export default todoSlice.reducer;
