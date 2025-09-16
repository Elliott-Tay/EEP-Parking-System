const express = require("express");
const router = express.Router();
const { sql, config } = require("../database/db");
const { authenticateToken } = require("./auth");

module.exports = router;