// Import required modules
const express = require("express");
const router = express.Router();
const StatusChangeOrderAuth = require("../../../middlewares/IndivitualAuth/AdminAuthMiddleware");
const changeStatus = require("../../../controllers/order/OrderStatusChange/statusChange");

// Define the route for creating data for an admin
router.post("/:id", StatusChangeOrderAuth, changeStatus);

module.exports = router;
