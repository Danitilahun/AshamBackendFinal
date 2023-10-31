// Import required modules
const express = require("express");
const router = express.Router();
const AdminMiddleware = require("../../../middlewares/IndivitualAuth/AdminAuthMiddleware");
const UserMiddleware = require("../../../middlewares/JoinedAuth/UserAuth");
const authMiddleware = require("../../../middlewares/adminAuth");
const createDeliveryGuy = require("../../../controllers/users/deliveryGuy/create");
const editDeliveryGuy = require("../../../controllers/users/deliveryGuy/edit");
const deleteDeliveryGuy = require("../../../controllers/users/deliveryGuy/delete");
const setDeliveryGuyActiveness = require("../../../controllers/users/deliveryGuy/setDeliveryGuyActiveness");
const handlePayController = require("../../../controllers/users/deliveryGuy/handleSalaryPay");
const {
  completeTask,
} = require("../../../controllers/users/deliveryGuy/CompleteTask");

// Define the route for creating data for an admin
router.post("/", UserMiddleware, createDeliveryGuy);
router.post("/completeTask", AdminMiddleware, completeTask);
router.post("/setActiveness", AdminMiddleware, setDeliveryGuyActiveness);
router.put("/:id", UserMiddleware, editDeliveryGuy);
router.put("/pay/:id/:active", AdminMiddleware, handlePayController);
router.delete("/:id", UserMiddleware, deleteDeliveryGuy);

// Export the router
module.exports = router;
