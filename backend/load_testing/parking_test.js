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
    encrypt: false, // use true if your SQL Server requires SSL
    enableArithAbort: true
  }
};
// ----------------------
// TEST PARAMETERS
// ----------------------
const totalRequests = 50000;      // Total read/write operations
const concurrency = 1000;         // Number of simultaneous operations
const stations = ["X1", "X2", "X3"]; // Example stations

// ----------------------
// HELPER FUNCTIONS
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
  return Math.random() < 0.9 ? "OK" : "ERROR"; // 10% error rate
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
    await pool.request()
      .input("VehicleNo", sql.NVarChar, vehicleNo)
      .input("Station", sql.NVarChar, station)
      .input("Status", sql.NVarChar, status)
      .input("EntryTime", sql.DateTime, now)
      .query("INSERT INTO ParkingTest (VehicleNo, Station, Status, EntryTime) VALUES (@VehicleNo, @Station, @Status, @EntryTime)");
    
    return { success: true, vehicleNo, station, status };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ----------------------
// READ FUNCTION
// ----------------------
async function readTest(pool) {
  try {
    const result = await pool.request()
      .query("SELECT TOP 5 * FROM ParkingTest ORDER BY Id DESC");
    return { success: true, data: result.recordset };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ----------------------
// MAIN STRESS TEST
// ----------------------
async function stressTest() {
  const pool = await sql.connect(config);

  const promises = [];

  for (let i = 0; i < totalRequests; i++) {
    if (promises.length >= concurrency) {
      await Promise.race(promises);
    }

    const p = (async () => {
      const writeResult = await writeTest(pool);
      const readResult = await readTest(pool);

      console.log({
        write: writeResult,
        read: readResult
      });
    })().finally(() => promises.splice(promises.indexOf(p), 1));

    promises.push(p);
  }

  await Promise.all(promises);
  console.log("Stress test completed!");
  sql.close();
}

stressTest();
