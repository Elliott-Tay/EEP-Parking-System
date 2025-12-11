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

// Schedule daily restart (24 hours)
function scheduleDailyRestart() {
  setInterval(() => {
    console.log(`[${new Date().toISOString()}] 24-hour restart triggered...`);
    serverProcess.kill();
    startServer();
  }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
}

// Initialize
startServer();
scheduleDailyRestart();