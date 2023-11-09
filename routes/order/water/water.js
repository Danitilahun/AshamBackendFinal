// Import required modules
const express = require("express");
const router = express.Router();
const AdminMiddleware = require("../../../middlewares/IndivitualAuth/AdminAuthMiddleware");
const WaterOrderAuth = require("../../../middlewares/JoinedAuth/OrderAuth");
const createWaterOrder = require("../../../controllers/order/WaterOrder/create");
const editWaterOrder = require("../../../controllers/order/WaterOrder/edit");
const deleteWaterOrder = require("../../../controllers/order/WaterOrder/delete");
const checkTableForThatDayExistMiddleware = require("../../../middlewares/checkTableForThatDayExistMiddleware");
const checkBranchData = require("../../../middlewares/checkBranchData");
const checkRequestBodyMiddleware = require("../../../middlewares/checkRequestBodyMiddleware");
const checkOrderData = require("../../../middlewares/checkOrderData");
const validateIdAndUpdatedData = require("../../../middlewares/validateIdAndUpdatedData");
const validateIdAndCnParams = require("../../../middlewares/validateIdAndCnParams");

// Define the route for creating data for an admin
router.post(
  "/",
  WaterOrderAuth,
  checkRequestBodyMiddleware,
  checkOrderData,
  checkBranchData,
  checkTableForThatDayExistMiddleware,
  createWaterOrder
);
router.put("/:id", WaterOrderAuth, validateIdAndUpdatedData, editWaterOrder);
router.delete(
  "/:id/:cn",
  AdminMiddleware,
  validateIdAndCnParams,
  deleteWaterOrder
);

module.exports = router;
