// Import required modules
const express = require("express");
const router = express.Router();
const AdminMiddleware = require("../../../middlewares/IndivitualAuth/AdminAuthMiddleware");
const WifiOrderAuth = require("../../../middlewares/JoinedAuth/OrderAuth");
const createWifiOrder = require("../../../controllers/order/WifiOrder/create");
const editWifiOrder = require("../../../controllers/order/WifiOrder/edit");
const deleteWifiOrder = require("../../../controllers/order/WifiOrder/delete");

const checkTableForThatDayExistMiddleware = require("../../../middlewares/checkTableForThatDayExistMiddleware");
const checkBranchData = require("../../../middlewares/checkBranchData");
const checkRequestBodyMiddleware = require("../../../middlewares/checkRequestBodyMiddleware");
const checkOrderData = require("../../../middlewares/checkOrderData");
const validateIdAndUpdatedData = require("../../../middlewares/validateIdAndUpdatedData");
const validateIdAndCnParams = require("../../../middlewares/validateIdAndCnParams");

// Define the route for creating data for an admin
router.post(
  "/",
  WifiOrderAuth,
  checkRequestBodyMiddleware,
  checkOrderData,
  checkBranchData,
  checkTableForThatDayExistMiddleware,
  createWifiOrder
);
router.put("/:id", WifiOrderAuth, validateIdAndUpdatedData, editWifiOrder);
router.delete(
  "/:id/:cn",
  AdminMiddleware,
  validateIdAndCnParams,
  deleteWifiOrder
);

module.exports = router;
