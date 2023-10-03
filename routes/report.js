const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reports");
const reportAuth = require("../middlewares/adminAuth");

// Define the route for creating data for an admin
router.post("/", reportAuth, reportController.CreateReport);
router.put("/:id", reportAuth, reportController.updateReport);
router.post("/collect", reportAuth, reportController.Collect);
router.post("/distribute", reportAuth, reportController.Distribute);
router.post("/hotel", reportAuth, reportController.HotelProfit);

module.exports = router;
