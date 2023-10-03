// Import required modules
const express = require("express");
const router = express.Router();
const AdminMiddleware = require("../../../middlewares/IndivitualAuth/AdminAuthMiddleware");
const WifiOrderAuth = require("../../../middlewares/JoinedAuth/OrderAuth");
const createWifiOrder = require("../../../controllers/order/WifiOrder/create");
const editWifiOrder = require("../../../controllers/order/WifiOrder/edit");
const deleteWifiOrder = require("../../../controllers/order/WifiOrder/delete");
const WifiAssigned = require("../../../controllers/order/WifiOrder/orderAssigned");

// Define the route for creating data for an admin
router.post("/", WifiOrderAuth, createWifiOrder);
router.post("/orderAssigned", AdminMiddleware, WifiAssigned);
router.put("/:id", WifiOrderAuth, editWifiOrder);
router.delete("/:id", WifiOrderAuth, deleteWifiOrder);

module.exports = router;
