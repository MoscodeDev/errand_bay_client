import React from "react";
import { Loader2 } from "lucide-react";

const LoadingSpinner = ({ text = "Loading...", fullScreen = false }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center ${
        fullScreen ? "fixed inset-0 bg-gradient-to-br from-blue-50 to-white z-50" : "p-4"
      }`}
    >
      {/* Logo or Brand Name */}
      <h1 className="text-2xl md:text-3xl font-bold text-blue-700 mb-4 animate-pulse">
        Errand <span className="text-orange-500">Bay</span>
      </h1>

      {/* Spinner */}
      <Loader2 className="animate-spin text-blue-600" size={50} />

      {/* Text */}
      {text && (
        <p className="mt-4 text-gray-600 text-lg md:text-xl animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
