// backend/database/test-db.js
const db = require("./db");

async function testConnection() {
  try {
    // Try a simple query
    const [rows] = await db.query("SELECT NOW() AS now");
    console.log("DB Connection Successful! Current time:", rows[0].now);
  } catch (err) {
    console.error("DB Connection Failed: ", err);
  } finally {
    // Close pool if you want (optional)
    await db.end();
  }
}

testConnection();