// Import required modules
const express = require("express");
const router = express.Router();
const AdminMiddleware = require("../../../middlewares/IndivitualAuth/AdminAuthMiddleware");
const AsbezaOrderAuth = require("../../../middlewares/JoinedAuth/OrderAuth");
const createAsbezaOrder = require("../../../controllers/order/AsbezaOrder/create");
const editAsbezaOrder = require("../../../controllers/order/AsbezaOrder/edit");
const deleteAsbezaOrder = require("../../../controllers/order/AsbezaOrder/delete");
const AsbezaAssigned = require("../../../controllers/order/AsbezaOrder/orderAssigned");

// Define the route for creating data for an admin
router.post("/", AsbezaOrderAuth, createAsbezaOrder);
router.post("/orderAssigned", AdminMiddleware, AsbezaAssigned);
router.put("/:id", AsbezaOrderAuth, editAsbezaOrder);
router.delete("/:id", AsbezaOrderAuth, deleteAsbezaOrder);

module.exports = router;
