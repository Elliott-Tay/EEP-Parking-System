// backend/database/test-db.js
const { sql, config } = require("./db");

async function testConnection() {
  let pool;
  try {
    pool = await sql.connect(config);
    const result = await pool.request().query("SELECT GETDATE() AS now");
    console.log("DB Connection Successful! Current time:", result.recordset[0].now);
  } catch (err) {
    console.error("DB Connection Failed:", err);
  } finally {
    if (pool) await pool.close();
  }
}

async function testStoredProc() {
  let pool;
  try {
    pool = await sql.connect(config);

    // Use .query() for regular SQL queries
    const result = await pool.request().query("SELECT * FROM dbo.MovementTrans");

    console.log("Query Result:", result.recordset);
  } catch (err) {
    console.error("Query Failed:", err);
  } finally {
    if (pool) await pool.close();
  }
}

// Run sequentially
(async () => {
  await testConnection();
  await testStoredProc();
})();