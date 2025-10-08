import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, requiredRole }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const decodeToken = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  };

  const refreshToken = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/auth/refresh`, {
        method: "POST",
        credentials: "include", // send cookies
      });

      if (!res.ok) throw new Error("Refresh failed");
      const data = await res.json();
      localStorage.setItem("token", data.token);
      return data.token;
    } catch (err) {
      console.error("Token refresh error:", err);
      localStorage.removeItem("token"); // clear invalid token
      return null;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      let token = localStorage.getItem("token");

      if (!token) {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      let payload = decodeToken(token);
      const now = Math.floor(Date.now() / 1000);

      // If token expired or invalid, try refresh
      if (!payload || (payload.exp && payload.exp < now)) {
        token = await refreshToken();
        if (!token) {
          setAuthorized(false); // no valid token, redirect
          setLoading(false);
          return;
        }
        payload = decodeToken(token);
      }

      // Check role if required
      if (requiredRole && payload.role !== requiredRole) {
        alert("Access denied: insufficient role");
        setAuthorized(false);
      } else {
        setAuthorized(true);
      }

      setLoading(false);
    };

    checkAuth();
  }, [requiredRole]);

  // While checking, show loading
  if (loading) return <div>Loading...</div>;

  // If unauthorized or token invalid/missing, redirect to home page
  if (!authorized) return <Navigate to="/" replace />;

  return React.cloneElement(children);
};

export default PrivateRoute;
