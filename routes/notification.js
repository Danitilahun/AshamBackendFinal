const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification");
const authMiddleware = require("../middlewares/adminAuth");
// Define the route for creating data for an admin
router.post(
  "/",
  authMiddleware,
  notificationController.CreateNotificationToken
);
module.exports = router;
