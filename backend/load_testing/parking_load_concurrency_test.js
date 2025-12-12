import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

// ----------------------
// MSSQL CONFIGURATION
// ----------------------
const config = {
  user: process.env.MSSQL_USER,
  password: process.env.MSSQL_PASSWORD,
  server: process.env.MSSQL_SERVER, 
  database: process.env.MSSQL_DATABASE, 
  options: {
    encrypt: false,
    enableArithAbort: true,
  },
};

// ----------------------
// TEST PARAMETERS
// ----------------------
const totalRequests = 75000; // Total read/write operations
const gates = 10;            // Simulated entrances/exits
const concurrencyPerGate = 10; // Simultaneous operations per gate
const stations = ["X1", "X2", "X3"];

// ----------------------
// HELPERS
// ----------------------
function randomVehicle() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  return (
    letters[Math.floor(Math.random() * letters.length)] +
    letters[Math.floor(Math.random() * letters.length)] +
    numbers[Math.floor(Math.random() * numbers.length)] +
    numbers[Math.floor(Math.random() * numbers.length)] +
    numbers[Math.floor(Math.random() * numbers.length)] +
    letters[Math.floor(Math.random() * letters.length)]
  );
}

function randomStation() {
  return stations[Math.floor(Math.random() * stations.length)];
}

function randomStatus() {
  return Math.random() < 0.9 ? "OK" : "ERROR";
}

// ----------------------
// WRITE FUNCTION
// ----------------------
async function writeTest(pool) {
  const vehicleNo = randomVehicle();
  const station = randomStation();
  const status = randomStatus();
  const now = new Date();

  try {
    await pool
      .request()
      .input("VehicleNo", sql.NVarChar, vehicleNo)
      .input("Station", sql.NVarChar, station)
      .input("Status", sql.NVarChar, status)
      .input("EntryTime", sql.DateTime, now)
      .query(
        "INSERT INTO ParkingTest (VehicleNo, Station, Status, EntryTime) VALUES (@VehicleNo, @Station, @Status, @EntryTime)"
      );
    return true;
  } catch {
    return false;
  }
}

// ----------------------
// MAIN STRESS TEST
// ----------------------
async function gateWorker(pool, opsPerGate, gateId) {
  let completed = 0;
  const promises = [];

  for (let i = 0; i < opsPerGate; i++) {
    if (promises.length >= concurrencyPerGate) {
      await Promise.race(promises);
    }

    const p = (async () => {
      await writeTest(pool);
      completed++;

      // Log per gate every 1000 ops
      if (completed % 1000 === 0) {
        console.log(`Gate ${gateId}: Completed ${completed}/${opsPerGate}`);
      }
    })().finally(() => promises.splice(promises.indexOf(p), 1));

    promises.push(p);
  }

  await Promise.all(promises);
  return completed;
}

async function stressTest() {
  const pool = await sql.connect(config);

  console.log("Starting carpark stress test...");
  const startTime = performance.now();

  const opsPerGate = Math.floor(totalRequests / gates);
  const gatePromises = [];

  for (let g = 1; g <= gates; g++) {
    gatePromises.push(gateWorker(pool, opsPerGate, g));
  }

  const results = await Promise.all(gatePromises);
  const totalCompleted = results.reduce((a, b) => a + b, 0);

  const endTime = performance.now();
  const durationSec = ((endTime - startTime) / 1000).toFixed(2);
  const opsPerSec = (totalCompleted / (endTime - startTime) * 1000).toFixed(2);

  console.log("--------------------------------------------------");
  console.log("Stress test completed!");
  console.log(`Total operations: ${totalCompleted}`);
  console.log(`Total time: ${durationSec} seconds`);
  console.log(`Average throughput: ${opsPerSec} ops/sec`);
  console.log("--------------------------------------------------");

  sql.close();
}

stressTest();