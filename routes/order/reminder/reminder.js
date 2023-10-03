// Import required modules
const express = require("express");
const router = express.Router();
const ReminderOrderAuth = require("../../../middlewares/IndivitualAuth/CallCenterAuthMiddleware");
const setReminder = require("../../../controllers/order/Reminder/remider");

// Define the route for creating data for an admin
router.post("/", ReminderOrderAuth, setReminder);

module.exports = router;
