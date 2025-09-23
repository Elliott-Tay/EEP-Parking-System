import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // No token → redirect to home/login
    return <Navigate to="/" replace />;
  }

  try {
    // Decode JWT payload
    const payloadBase64 = token.split(".")[1];
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);

    const now = Math.floor(Date.now() / 1000); // current time in seconds
    if (payload.exp && payload.exp < now) {
      // Token expired → remove it and reload
      localStorage.removeItem("token");
      window.location.replace("/"); // full reload to ensure token is gone
      return null;
    }

    // Check for role if required
    if (requiredRole && payload.role !== requiredRole) {
      // Show alert message
      alert("Access denied: Admins only");

      // User does not have required role → redirect
      return <Navigate to="/" replace />;
    }

    // Token valid and role allowed → render page
    return children;
  } catch (err) {
    console.error("Invalid token:", err);
    localStorage.removeItem("token");
    window.location.replace("/"); // reload on invalid token
    return null;
  }
};

export default PrivateRoute;
