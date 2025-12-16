import { spawn } from "child_process";
import fs from "fs";
import path from "path";

// =========================
// Configuration
// =========================
const SERVER_COMMAND = "node";
const SERVER_ARGS = ["server.js"];

const REBOOT_INTERVAL_MS = 14 * 24 * 60 * 60 * 1000; // 14 days
const REBOOT_FILE = path.resolve("./last_reboot.txt");

// =========================
// State
// =========================
let serverProcess = null;
let rebootTimer = null;

// =========================
// Utilities
// =========================
function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

function saveRebootTime() {
  fs.writeFileSync(REBOOT_FILE, Date.now().toString(), "utf8");
}

function getLastRebootTime() {
  if (!fs.existsSync(REBOOT_FILE)) {
    saveRebootTime();
  }
  return Number(fs.readFileSync(REBOOT_FILE, "utf8"));
}

// =========================
// Server lifecycle
// =========================
function startServer() {
  log("Starting server...");
  saveRebootTime();

  serverProcess = spawn(SERVER_COMMAND, SERVER_ARGS, {
    stdio: "inherit",
  });

  serverProcess.on("exit", (code, signal) => {
    if (signal) {
      log(`Server terminated by signal: ${signal}`);
    } else {
      log(`Server exited with code: ${code}`);
    }

    // Restart immediately on crash or unexpected exit
    log("Restarting server...");
    startServer();
  });

  scheduleNextReboot();
}

// =========================
// Reboot scheduler
// =========================
function scheduleNextReboot() {
  if (rebootTimer) {
    clearTimeout(rebootTimer);
  }

  const lastReboot = getLastRebootTime();
  const nextReboot = lastReboot + REBOOT_INTERVAL_MS;
  const delay = nextReboot - Date.now();

  const hours = Math.max(delay, 0) / (1000 * 60 * 60);
  log(`Next reboot scheduled in ${hours.toFixed(2)} hours`);

  rebootTimer = setTimeout(() => {
    log("14-day reboot triggered");
    serverProcess.kill();
    // startServer() will be called automatically by exit handler
  }, Math.max(delay, 0));
}

// =========================
// Graceful shutdown (optional but recommended)
// =========================
function shutdown() {
  log("Manager shutting down...");
  if (serverProcess) {
    serverProcess.kill();
  }
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// =========================
// Init
// =========================
startServer();
