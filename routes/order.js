// Import required modules
const express = require("express");
const admin = require("firebase-admin");
const orderAuth = require("../middlewares/orderAuth");
const orderController = require("../controllers/order");

// Create a new router for orders
const router = express.Router();

// Create a route for creating a new order
router.post("/", orderAuth, orderController.CreateOrder);
router.post("/setReminder", orderAuth, orderController.setReminder);
// Create a route for updating an existing order
router.put("/:id", orderAuth, orderController.updateOrder);

// Create a route for deleting an existing order
router.delete("/:collection/:id/", orderAuth, orderController.deleteOrder);
router.post(
  "/:collectionName/:docId/:newStatus",
  orderAuth,
  orderController.changeStatus
);
router.post(
  "/profit/setprice/:collectionName/:docId/",
  orderAuth,
  orderController.AsbezaProfit
);

// Export the router
module.exports = router;
