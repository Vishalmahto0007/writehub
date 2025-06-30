import React from "react";

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Loading...",
}) => (
  <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-white mx-auto"></div>
      <p className="text-gray-600 dark:text-gray-200 mt-2">{message}</p>
    </div>
  </div>
);

export default LoadingSpinner;
