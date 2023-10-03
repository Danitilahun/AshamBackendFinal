// Import required modules
const express = require("express");
const router = express.Router();
const ReportAuth = require("../../../middlewares/IndivitualAuth/AdminAuthMiddleware");
const HotelProfitReport = require("../../../controllers/report/hotelProfit");

// Define the route for creating data for an admin
router.post("/", ReportAuth, HotelProfitReport);

module.exports = router;
