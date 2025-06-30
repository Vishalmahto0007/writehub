import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authAPI } from "../services/api";
import LoadingSpinner from "./UI/LoadingSpinner";

interface Props {
  authRequired?: boolean;
  children?: React.ReactNode;
}

const AuthRoute: React.FC<Props> = ({ authRequired = true, children }) => {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();

  // Flag from localStorage to re-check auth status
  const [authKey, setAuthKey] = useState<number>(Date.now());

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await authAPI.getMe(); // Will fail if cookies are cleared
        setIsAuth(true);
      } catch {
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Trigger re-check on custom event (logout/login)
    const onStorage = (event: StorageEvent) => {
      if (event.key === "auth-event") {
        setAuthKey(Date.now()); // Force re-check
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [authKey]); // 👈 re-run auth check when triggered

  if (loading)
    return (
      <div>
        <LoadingSpinner />
      </div>
    );

  if (!authRequired && isAuth) {
    return <Navigate to="/dashboard" replace />;
  }

  if (authRequired && !isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children || <Outlet />}</>;
};

export default AuthRoute;
