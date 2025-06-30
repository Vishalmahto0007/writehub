import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { useAppSelector, useAppDispatch } from "./hooks/redux";
import AuthRoute from "./components/AuthRoute";
import Layout from "./components/Layout/Layout";

import Dashboard from "./pages/Dashboard";
import BlogPage from "./pages/BlogPage";
import TodoPage from "./pages/TodoPage";
import NotesPage from "./pages/NotesPage";
import GoalsPage from "./pages/GoalsPage";

import LoginForm from "./pages/Auth/Login";
import SignupForm from "./pages/Auth/Signup";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import Verify from "./pages/Auth/Verify";
import { fetchCurrentUser } from "./store/slices/authSlice";

import "./index.css";

const App: React.FC = () => {
  const { theme } = useAppSelector((state) => state.ui);
  const dispatch = useAppDispatch();

  // 🌙 Theme toggle
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);

  return (
    <Router>
      <Toaster position="top-center" />

      <Routes>
        {/* 🔓 Public routes */}
        <Route
          path="/login"
          element={
            <AuthRoute authRequired={false}>
              <LoginForm />
            </AuthRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthRoute authRequired={false}>
              <SignupForm />
            </AuthRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <AuthRoute authRequired={false}>
              <ForgotPassword />
            </AuthRoute>
          }
        />
        <Route
          path="/verify"
          element={
            <AuthRoute authRequired={false}>
              <Verify />
            </AuthRoute>
          }
        />

        {/* 🔒 Protected routes */}
        <Route
          path="/"
          element={
            <AuthRoute>
              <Layout />
            </AuthRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="todo" element={<TodoPage />} />
          <Route path="notes" element={<NotesPage />} />
          <Route path="goals" element={<GoalsPage />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
