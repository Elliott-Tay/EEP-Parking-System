import { spawn } from "child_process";

let serverProcess;

function startServer() {
  console.log(`[${new Date().toISOString()}] Starting server...`);

  serverProcess = spawn("node", ["server.js"], { stdio: "inherit" });

  // If server crashes, restart immediately
  serverProcess.on("exit", (code, signal) => {
    if (signal) {
      console.log(`[${new Date().toISOString()}] Server killed with signal: ${signal}`);
    } else if (code !== 0) {
      console.log(`[${new Date().toISOString()}] Server exited with code ${code}. Restarting...`);
      startServer();
    }
  });
}

// Schedule daily restart at 3 AM
function scheduleDailyRestartAt3AM() {
  const now = new Date();
  const next3AM = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    3, 0, 0, 0
  );

  // If 3 AM already passed today, schedule for tomorrow
  if (now >= next3AM) {
    next3AM.setDate(next3AM.getDate() + 1);
  }

  const delay = next3AM - now; // milliseconds until next 3 AM

  setTimeout(() => {
    console.log(`[${new Date().toISOString()}] Restart at 3 AM triggered...`);
    serverProcess.kill();
    startServer();

    // Schedule subsequent restarts every 24 hours
    setInterval(() => {
      console.log(`[${new Date().toISOString()}] Restart at 3 AM triggered...`);
      serverProcess.kill();
      startServer();
    }, 24 * 60 * 60 * 1000);

  }, delay);
}

// Initialize
startServer();
scheduleDailyRestartAt3AM();