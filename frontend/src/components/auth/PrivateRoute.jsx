import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, requiredRole }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      let token = localStorage.getItem("token");

      if (!token) {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      try {
        // Decode JWT
        const payload = JSON.parse(atob(token.split(".")[1]));
        const now = Math.floor(Date.now() / 1000);

        if (payload.exp && payload.exp < now) {
          const res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/api/auth/refresh`, {
            method: "POST",
            credentials: "include",
          });
          if (!res.ok) throw new Error("Refresh failed");

          const data = await res.json();
          localStorage.setItem("token", data.token);
          token = data.token;

          // decode the new token
          payload = JSON.parse(atob(token.split(".")[1]));
        }

        // Check role if required
        if (requiredRole && payload.role !== requiredRole) {
          alert("Access denied: insufficient role");
          setAuthorized(false);
        } else {
          setAuthorized(true);
        }
      } catch (err) {
        console.error("Auth error:", err);
        localStorage.removeItem("token");
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [requiredRole]);

  if (loading) return <div>Loading...</div>;
  if (!authorized) return <Navigate to="/" replace />;

  return children;
};

export default PrivateRoute;
