// Import required modules
const express = require("express");
const router = express.Router();
const FinanceCreditAuth = require("../../../middlewares/IndivitualAuth/FinanceAuthMiddleware");
const createFinanceCredit = require("../../../controllers/credit/financeCredit/create");
const editFinanceCredit = require("../../../controllers/credit/financeCredit/edit");
const deleteFinanceCredit = require("../../../controllers/credit/financeCredit/delete");
const checkRequestBodyMiddleware = require("../../../middlewares/checkRequestBodyMiddleware");

// Define the route for creating data for an admin
router.post(
  "/",
  FinanceCreditAuth,
  checkRequestBodyMiddleware,
  createFinanceCredit
);
router.put("/:id", FinanceCreditAuth, editFinanceCredit);
router.delete("/:id", FinanceCreditAuth, deleteFinanceCredit);

module.exports = router;
