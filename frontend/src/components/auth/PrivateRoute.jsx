import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // check if user is logged in

  if (!token) {
    // Not logged in → redirect to home or login page
    return <Navigate to="/" replace />;
  }

  // Logged in → render the protected page
  return children;
};

export default PrivateRoute;