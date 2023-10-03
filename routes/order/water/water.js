// Import required modules
const express = require("express");
const router = express.Router();
const AdminMiddleware = require("../../../middlewares/IndivitualAuth/AdminAuthMiddleware");
const WaterOrderAuth = require("../../../middlewares/JoinedAuth/OrderAuth");
const createWaterOrder = require("../../../controllers/order/WaterOrder/create");
const editWaterOrder = require("../../../controllers/order/WaterOrder/edit");
const deleteWaterOrder = require("../../../controllers/order/WaterOrder/delete");
const WaterAssigned = require("../../../controllers/order/WaterOrder/orderAssigned");

// Define the route for creating data for an admin
router.post("/", WaterOrderAuth, createWaterOrder);
router.post("/orderAssigned", AdminMiddleware, WaterAssigned);
router.put("/:id", WaterOrderAuth, editWaterOrder);
router.delete("/:id", WaterOrderAuth, deleteWaterOrder);

module.exports = router;
