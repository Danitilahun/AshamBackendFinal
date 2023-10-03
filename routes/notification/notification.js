// Import required modules
const express = require("express");
const CreateNotificationToken = require("../../controllers/notification/createNotification");
const router = express.Router();

// Define the route for creating data for an admin
router.post("/", CreateNotificationToken);

// Export the router
module.exports = router;
