import React, { useEffect, useState, useCallback } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const PrivateRoute = ({ children, requiredRole }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();

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
        credentials: "include",
      });

      if (!res.ok) throw new Error("Token refresh failed");

      const data = await res.json();
      localStorage.setItem("token", data.token);
      return data.token;
    } catch (err) {
      console.error("Token refresh error:", err);
      localStorage.removeItem("token");
      return null;
    }
  };

  // 🔥 Logout function used by idle timeout
  const logoutDueToIdle = useCallback(() => {
    localStorage.removeItem("token");
    alert("You have been logged out due to 10 minutes of inactivity.");
    navigate("/", { replace: true });
  }, [navigate]);

  useEffect(() => {
    const checkAuth = async () => {
      let token = localStorage.getItem("token");

      // No token → unauthorized
      if (!token) {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      let payload = decodeToken(token);
      const now = Math.floor(Date.now() / 1000);

      // Expired token → try refresh
      if (!payload || (payload.exp && payload.exp < now)) {
        token = await refreshToken();
        if (!token) {
          setAuthorized(false);
          setLoading(false);
          return;
        }
        payload = decodeToken(token);
      }

      // Role check
      if (requiredRole && payload?.role !== requiredRole) {
        alert("Access denied: insufficient role");
        setAuthorized(false);
      } else {
        setAuthorized(true);
      }

      setLoading(false);
    };

    checkAuth();
  }, [requiredRole]);

  // 🔥 Idle Timeout Logic (10 minutes)
  useEffect(() => {
    if (!authorized) return;

    const IDLE_LIMIT = 10 * 60 * 1000; // 10 minutes
    let idleTimeout = setTimeout(logoutDueToIdle, IDLE_LIMIT);

    const resetIdleTimer = () => {
      clearTimeout(idleTimeout);
      idleTimeout = setTimeout(logoutDueToIdle, IDLE_LIMIT);
    };

    window.addEventListener("mousemove", resetIdleTimer);
    window.addEventListener("keydown", resetIdleTimer);
    window.addEventListener("click", resetIdleTimer);

    return () => {
      clearTimeout(idleTimeout);
      window.removeEventListener("mousemove", resetIdleTimer);
      window.removeEventListener("keydown", resetIdleTimer);
      window.removeEventListener("click", resetIdleTimer);
    };
  }, [authorized, logoutDueToIdle]);

  // Loading screen
  if (loading) return <div>Loading...</div>;

  // Not authorized → redirect
  if (!authorized) return <Navigate to="/" replace />;

  return React.cloneElement(children);
};

export default PrivateRoute;
