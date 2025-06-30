import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authAPI } from "../services/api";
import LoadingSpinner from "./UI/LoadingSpinner";

interface Props {
  authRequired?: boolean;
  children?: React.ReactNode;
}

const AuthRoute: React.FC<Props> = ({ authRequired = true, children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await authAPI.getMe();
        setIsAuth(true);
      } catch {
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
    // Listen for storage events (e.g., login/logout in another tab)
    const onStorage = () => checkAuth();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  if (loading)
    return (
      <div>
        <LoadingSpinner />
      </div>
    );

  //  Public route — redirect to dashboard if already authenticated
  if (!authRequired && isAuth) {
    return <Navigate to="/dashboard" replace />;
  }

  //  Private route — redirect to login if not authenticated
  if (authRequired && !isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children || <Outlet />}</>;
};

export default AuthRoute;
