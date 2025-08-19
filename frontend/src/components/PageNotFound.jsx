// src/components/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FiAlertCircle } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="text-center">
        <FiAlertCircle className="text-red-500 w-16 h-16 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
        <p className="text-gray-600 mb-6">Oops! The page you’re looking for doesn’t exist.</p>
        <Link
          to="/"
          className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-600 transition"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
