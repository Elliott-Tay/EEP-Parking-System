// backend/app.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ message: "Carpark system backend is running" });
});

app.get("/", (req, res) => {
  res.send("Welcome to the Carpark System API");
})


//Export the app for use in server.js
module.exports = app;