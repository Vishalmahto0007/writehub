import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import LoadingSpinner from "./UI/LoadingSpinner";
import { RootState } from "../store/index";

interface Props {
  authRequired?: boolean;
  children?: React.ReactNode;
}

const AuthRoute: React.FC<Props> = ({ authRequired = true, children }) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (authRequired && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!authRequired && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children || <Outlet />}</>;
};

export default AuthRoute;
