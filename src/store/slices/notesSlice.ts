import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { notesAPI } from "../../services/api";

interface Note {
  id: string;
  title: string;
  content: string;
  type: "personal" | "work" | "study" | "ideas" | "reminders";
  createdAt: string;
  updatedAt: string;
}

interface NotesState {
  notes: Note[];
  currentNote: Note | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    totalPages: number;
    total: number;
  };
  filters: {
    search: string;
    type: string;
  };
}

const initialState: NotesState = {
  notes: [],
  currentNote: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    totalPages: 1,
    total: 0,
  },
  filters: {
    search: "",
    type: "all",
  },
};

export const fetchNotes = createAsyncThunk(
  "notes/fetchNotes",
  async (params: { page?: number; search?: string; type?: string }) => {
    const response = await notesAPI.getNotes(params);
    return response;
  }
);

export const createNote = createAsyncThunk(
  "notes/createNote",
  async (noteData: { title: string; content: string; type: Note["type"] }) => {
    const response = await notesAPI.createNote(noteData);
    return response;
  }
);

export const updateNote = createAsyncThunk(
  "blog/updateNote",
  async (noteData: {
    id: string;
    title: string;
    content: string;
    type: string;
  }) => {
    const response = await notesAPI.updateNote(noteData.id, noteData);
    return response;
  }
);

export const deleteNote = createAsyncThunk(
  "notes/deleteNote",
  async (id: string) => {
    await notesAPI.deleteNote(id);
    return id;
  }
);

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    setFilters: (
      state,
      action: PayloadAction<Partial<NotesState["filters"]>>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setCurrentNote: (state, action: PayloadAction<Note | null>) => {
      state.currentNote = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.isLoading = false;
        if (
          action.meta.arg &&
          action.meta.arg.page &&
          action.meta.arg.page > 1
        ) {
          state.notes = [...state.notes, ...action.payload.notes];
        } else {
          state.notes = action.payload.notes;
        }
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch notes";
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.notes.unshift(action.payload);
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        const index = state.notes.findIndex((n) => n.id === action.payload.id);
        if (index !== -1) {
          state.notes[index] = action.payload;
        }
        if (state.currentNote && state.currentNote.id === action.payload.id) {
          state.currentNote = action.payload;
        }
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.notes = state.notes.filter((n) => n.id !== action.payload);
      });
  },
});

export const { setFilters, setCurrentNote } = notesSlice.actions;
export default notesSlice.reducer;
