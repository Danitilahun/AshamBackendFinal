// Import required modules
const express = require("express");
const router = express.Router();
const ReportAuth = require("../../../middlewares/IndivitualAuth/AdminAuthMiddleware");
const AsbezaProfitReport = require("../../../controllers/report/asbezaProfit");

// Define the route for creating data for an admin
router.post("/", ReportAuth, AsbezaProfitReport);

module.exports = router;
