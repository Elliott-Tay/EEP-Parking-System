// backend/server.js
import app from "./app.js";
import http from "http";
import { Server } from "socket.io";

const PORT = process.env.PORT || 5000;

// Create HTTP server from Express app
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // restrict to your React app domain in production
    methods: ["GET", "POST"]
  }
});

// Handle client connections
io.on("connection", (socket) => {
  console.log("React client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("React client disconnected:", socket.id);
  });
});

// Start the server (note: use `server.listen`, not `app.listen`)
server.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

// Optional: export io for use in routes
export { io };