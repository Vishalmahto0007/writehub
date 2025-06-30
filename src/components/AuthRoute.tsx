import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppDispatch } from "../hooks/redux";
import { fetchCurrentUser } from "../store/slices/authSlice";
import LoadingSpinner from "./UI/LoadingSpinner";
import { authAPI } from "../services/api";

interface Props {
  authRequired?: boolean;
  children?: React.ReactNode;
}

const AuthRoute: React.FC<Props> = ({ authRequired = true, children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      if (!authRequired) {
        setIsAuth(false); // Or true if you want public to skip check
        setLoading(false);
        return;
      }

      try {
        await dispatch(fetchCurrentUser());
        setIsAuth(true);
      } catch {
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [authRequired]);

  if (loading) return <LoadingSpinner />;

  if (!authRequired && isAuth) {
    return <Navigate to="/dashboard" replace />;
  }

  if (authRequired && !isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AuthRoute;
