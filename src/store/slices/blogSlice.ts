import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { blogAPI } from "../../services/api";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface BlogState {
  posts: BlogPost[];
  currentPost: BlogPost | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    totalPages: number;
    total: number;
  };
  filters: {
    search: string;
    sortBy: "latest" | "oldest";
  };
}

const initialState: BlogState = {
  posts: [],
  currentPost: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    totalPages: 1,
    total: 0,
  },
  filters: {
    search: "",
    sortBy: "latest",
  },
};

export const fetchBlogs = createAsyncThunk(
  "blog/fetchBlogs",
  async (params: { page?: number; search?: string; sortBy?: string }) => {
    const response = await blogAPI.getBlogs(params);
    return response;
  }
);

export const createBlog = createAsyncThunk(
  "blog/createBlog",
  async (blogData: { title: string; content: string; imageUrl?: string }) => {
    const response = await blogAPI.createBlog(blogData);
    return response;
  }
);

export const updateBlog = createAsyncThunk(
  "blog/updateBlog",
  async (blogData: {
    id: string;
    title: string;
    content: string;
    imageUrl?: string;
  }) => {
    const response = await blogAPI.updateBlog(blogData.id, blogData);
    return response;
  }
);

export const deleteBlog = createAsyncThunk(
  "blog/deleteBlog",
  async (id: string) => {
    await blogAPI.deleteBlog(id);
    return id;
  }
);

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    setFilters: (
      state,
      action: PayloadAction<Partial<BlogState["filters"]>>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentPost: (state, action: PayloadAction<BlogPost | null>) => {
      state.currentPost = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.meta.arg.page && action.meta.arg.page > 1) {
          state.posts = [...state.posts, ...action.payload.posts];
        } else {
          state.posts = action.payload.posts;
        }
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch blogs";
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        const idx = state.posts.findIndex(
          (post) => post.id === action.payload.id
        );
        if (idx !== -1) {
          state.posts[idx] = action.payload;
        }
        if (state.currentPost && state.currentPost.id === action.payload.id) {
          state.currentPost = action.payload;
        }
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post.id !== action.payload);
      });
  },
});

export const { setFilters, clearError, setCurrentPost } = blogSlice.actions;
export default blogSlice.reducer;
