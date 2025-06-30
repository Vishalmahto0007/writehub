import axios, { AxiosResponse } from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    dob: string;
    gender: string;
  }) => {
    const response = await api.post("/auth/signup", userData);
    return response.data;
  },
  forgotPassword: async (email: string) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },
  verifyResetCode: async (email: string, code: string, newPassword: string) => {
    const response = await api.post("/auth/verify-reset", {
      email,
      code,
      newPassword,
    });
    return response.data;
  },
  resetPassword: async (token: string, password: string) => {
    const response = await api.post("/auth/reset-password", {
      token,
      password,
    });
    return response.data;
  },
  verifyCode: async (email: string, code: string) => {
    const response = await api.post("/auth/verify", { email, code });
    return response.data;
  },
  resendVerificationCode: async (email: string) => {
    const response = await api.post("/auth/resend-verification-code", {
      email,
    });
    return response.data;
  },
  getMe: async () => {
    const response: AxiosResponse<{ user: any }> = await api.get("/auth/me");
    return response.data;
  },
  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },
};

// Blogs
export const blogAPI = {
  getBlogs: async (params: {
    page?: number;
    search?: string;
    sortBy?: string;
  }) => {
    const response = await api.get("/blogs", { params });
    return response.data;
  },
  getBlog: async (id: string) => {
    const response = await api.get(`/blogs/${id}`);
    return response.data;
  },
  createBlog: async (blogData: {
    title: string;
    content: string;
    imageUrl?: string;
  }) => {
    const response = await api.post("/blogs", blogData);
    return response.data;
  },
  updateBlog: async (id: string, updates: any) => {
    const response = await api.put(`/blogs/${id}`, updates);
    return response.data;
  },
  deleteBlog: async (id: string) => {
    await api.delete(`/blogs/${id}`);
  },
};

// Todos
export const todoAPI = {
  getTodos: async () => {
    const response = await api.get("/todos");
    return response.data;
  },
  createTodo: async (todoData: { title: string; priority: string }) => {
    const response = await api.post("/todos", todoData);
    return response.data;
  },
  updateTodo: async (id: string, updates: any) => {
    const response = await api.put(`/todos/${id}`, updates);
    return response.data;
  },
  deleteTodo: async (id: string) => {
    await api.delete(`/todos/${id}`);
  },
};

// Notes
export const notesAPI = {
  getNotes: async (params: {
    page?: number;
    search?: string;
    type?: string;
    sortBy?: string;
  }) => {
    const response = await api.get("/notes", { params });
    return response.data;
  },
  createNote: async (noteData: {
    title: string;
    content: string;
    type: string;
  }) => {
    const response = await api.post("/notes", noteData);
    return response.data;
  },
  updateNote: async (id: string, updates: any) => {
    const response = await api.put(`/notes/${id}`, updates);
    return response.data;
  },
  deleteNote: async (id: string) => {
    await api.delete(`/notes/${id}`);
  },
};

// Goals
export const goalsAPI = {
  getGoals: async () => {
    const response = await api.get("/goals");
    return response.data;
  },
  createGoal: async (goalData: {
    title: string;
    content: string;
    targetDate: string;
    status: string;
  }) => {
    const response = await api.post("/goals", goalData);
    return response.data;
  },
  updateGoal: async (
    id: string,
    updates: Partial<{
      title: string;
      content: string;
      targetDate: string;
      status: "start" | "completed";
    }>
  ) => {
    const response = await api.put(`/goals/${id}`, updates);
    return response.data;
  },
  deleteGoal: async (id: string) => {
    await api.delete(`/goals/${id}`);
  },
};

//Dashboard
export const dashboardAPI = {
  getDashbaord: async () => {
    const response = await api.get("/dashboard");
    return response.data;
  },
};
export default api;
