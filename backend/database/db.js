// db.js
const sql = require("mssql");

require("dotenv").config();

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

async function query(sqlQuery) {
  const pool = await sql.connect(config);
  return pool.request().query(sqlQuery);
}

module.exports = {
  sql,
  config,
  query
};