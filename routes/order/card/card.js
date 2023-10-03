// Import required modules
const express = require("express");
const router = express.Router();
const AdminMiddleware = require("../../../middlewares/IndivitualAuth/AdminAuthMiddleware");
const CardOrderAuth = require("../../../middlewares/JoinedAuth/OrderAuth");
const createCardOrder = require("../../../controllers/order/CardOrder/create");
const editCardOrder = require("../../../controllers/order/CardOrder/edit");
const deleteCardOrder = require("../../../controllers/order/CardOrder/delete");
const CardAssigned = require("../../../controllers/order/CardOrder/orderAssigned");

// Define the route for creating data for an admin
router.post("/", CardOrderAuth, createCardOrder);
router.post("/orderAssigned", AdminMiddleware, CardAssigned);
router.put("/:id", CardOrderAuth, editCardOrder);
router.delete("/:id", CardOrderAuth, deleteCardOrder);

module.exports = router;
