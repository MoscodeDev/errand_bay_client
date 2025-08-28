import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="text-center">
        <AlertCircle className="mx-auto text-red-500" size={80} />
        <h1 className="text-6xl font-bold text-gray-800 mt-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mt-2">
          Page Not Found
        </h2>
        <p className="text-gray-500 mt-2">
          Oops! The page you are looking for doesn’t exist or has been moved.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
