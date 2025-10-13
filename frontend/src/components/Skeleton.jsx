// components/Skeleton.js
import React from "react";

export default function Skeleton({ width = "100%", height = "20px", className = "" }) {
  return (
    <div
      className={`bg-gray-300 animate-pulse rounded ${className}`}
      style={{ width, height }}
    ></div>
  );
}