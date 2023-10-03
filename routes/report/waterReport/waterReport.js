// Import required modules
const express = require("express");
const router = express.Router();
const ReportAuth = require("../../../middlewares/IndivitualAuth/AdminAuthMiddleware");
const WaterDistributeReport = require("../../../controllers/report/waterDistribute");

// Define the route for creating data for an admin
router.post("/", ReportAuth, WaterDistributeReport);

module.exports = router;
