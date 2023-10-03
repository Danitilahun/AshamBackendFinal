// Import required modules
const express = require("express");
const router = express.Router();
const ReportAuth = require("../../../middlewares/IndivitualAuth/AdminAuthMiddleware");
const CardDistrubuteReport = require("../../../controllers/report/cardDistribute");
// Define the route for creating data for an admin
router.post("/", ReportAuth, CardDistrubuteReport);

module.exports = router;
