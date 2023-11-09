// Import required modules
const express = require("express");
const router = express.Router();
const AdminMiddleware = require("../../../middlewares/IndivitualAuth/AdminAuthMiddleware");
const CardOrderAuth = require("../../../middlewares/JoinedAuth/OrderAuth");
const createCardOrder = require("../../../controllers/order/CardOrder/create");
const editCardOrder = require("../../../controllers/order/CardOrder/edit");
const deleteCardOrder = require("../../../controllers/order/CardOrder/delete");

const checkTableForThatDayExistMiddleware = require("../../../middlewares/checkTableForThatDayExistMiddleware");
const checkBranchData = require("../../../middlewares/checkBranchData");
const checkRequestBodyMiddleware = require("../../../middlewares/checkRequestBodyMiddleware");
const checkOrderData = require("../../../middlewares/checkOrderData");
const validateIdAndUpdatedData = require("../../../middlewares/validateIdAndUpdatedData");
const validateIdAndCnParams = require("../../../middlewares/validateIdAndCnParams");

// Define the route for creating data for an admin
router.post(
  "/",
  CardOrderAuth,
  checkRequestBodyMiddleware,
  checkOrderData,
  checkBranchData,
  checkTableForThatDayExistMiddleware,
  createCardOrder
);
router.put("/:id", CardOrderAuth, validateIdAndUpdatedData, editCardOrder);
router.delete(
  "/:id/:cn",
  AdminMiddleware,
  validateIdAndCnParams,
  deleteCardOrder
);

module.exports = router;
