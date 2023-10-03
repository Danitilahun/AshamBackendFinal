// Import required modules
const express = require("express");
const router = express.Router();
const ReportAuth = require("../../../middlewares/IndivitualAuth/AdminAuthMiddleware");
const CardFeeReport = require("../../../controllers/report/cardFee");
const returnedCard = require("../../../controllers/report/returnedcard");

// Define the route for creating data for an admin
router.post("/", ReportAuth, CardFeeReport);
router.put("/:id", ReportAuth, returnedCard);
module.exports = router;
