import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, requiredRole }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  // Helper: decode JWT
  const decodeToken = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  };

  // Helper: refresh token
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
      localStorage.removeItem("token");
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

      if (!payload || (payload.exp && payload.exp < now)) {
        token = await refreshToken();
        if (!token) {
          setAuthorized(false);
          setLoading(false);
          return;
        }
        payload = decodeToken(token);
      }

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

  // Attach token to fetch wrapper for protected API calls
  const authFetch = async (url, options = {}) => {
    let token = localStorage.getItem("token");
    if (!options.headers) options.headers = {};
    options.headers["Authorization"] = `Bearer ${token}`;
    return fetch(url, options);
  };

  if (loading) return <div>Loading...</div>;
  if (!authorized) return <Navigate to="/" replace />;

  // Pass authFetch to children as a prop if needed
  return React.cloneElement(children, { authFetch });
};

export default PrivateRoute;
