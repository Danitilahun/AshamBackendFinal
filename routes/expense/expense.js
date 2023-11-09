// Import required modules
const express = require("express");
const router = express.Router();
const ExpenseAuth = require("../../middlewares/IndivitualAuth/FinanceAuthMiddleware");
const createExpense = require("../../controllers/expense/create");
const editExpense = require("../../controllers/expense/edit");
const deleteExpense = require("../../controllers/expense/delete");
const validateIdParam = require("../../middlewares/validateIdParam");
const checkRequestBodyMiddleware = require("../../middlewares/checkRequestBodyMiddleware");

// Define the route for creating data for an admin
router.post("/", ExpenseAuth, checkRequestBodyMiddleware, createExpense);
router.put("/:id", ExpenseAuth, validateIdParam, editExpense);
router.delete("/:id", ExpenseAuth, validateIdParam, deleteExpense);

module.exports = router;
