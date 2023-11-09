// Import required modules
const express = require("express");
const router = express.Router();
const AdminMiddleware = require("../../../middlewares/IndivitualAuth/AdminAuthMiddleware");
const AsbezaOrderAuth = require("../../../middlewares/JoinedAuth/OrderAuth");
const createAsbezaOrder = require("../../../controllers/order/AsbezaOrder/create");
const editAsbezaOrder = require("../../../controllers/order/AsbezaOrder/edit");
const deleteAsbezaOrder = require("../../../controllers/order/AsbezaOrder/delete");

const checkTableForThatDayExistMiddleware = require("../../../middlewares/checkTableForThatDayExistMiddleware");
const checkBranchData = require("../../../middlewares/checkBranchData");
const checkRequestBodyMiddleware = require("../../../middlewares/checkRequestBodyMiddleware");
const checkOrderData = require("../../../middlewares/checkOrderData");
const validateIdAndUpdatedData = require("../../../middlewares/validateIdAndUpdatedData");
const validateIdAndCnParams = require("../../../middlewares/validateIdAndCnParams");

// Define the route for creating data for an admin
router.post(
  "/",
  AsbezaOrderAuth,
  checkRequestBodyMiddleware,
  checkOrderData,
  checkBranchData,
  checkTableForThatDayExistMiddleware,
  createAsbezaOrder
);

router.put("/:id", AsbezaOrderAuth, validateIdAndUpdatedData, editAsbezaOrder);
router.delete(
  "/:id/:cn",
  AdminMiddleware,
  validateIdAndCnParams,
  deleteAsbezaOrder
);

module.exports = router;
