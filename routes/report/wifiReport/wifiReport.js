// Import required modules
const express = require("express");
const router = express.Router();
const ReportAuth = require("../../../middlewares/IndivitualAuth/AdminAuthMiddleware");
const WifiDistributeReport = require("../../../controllers/report/wifiDistribute");

// Define the route for creating data for an admin
router.post("/", ReportAuth, WifiDistributeReport);

module.exports = router;
