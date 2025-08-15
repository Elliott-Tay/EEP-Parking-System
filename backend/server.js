// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Example route
app.get("/api/health", (req, res) => {
  res.json({ message: "Carpark system backend is running" });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});