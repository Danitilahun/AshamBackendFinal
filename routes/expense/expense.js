// Import required modules
const express = require("express");
const router = express.Router();
const ExpenseAuth = require("../../middlewares/IndivitualAuth/FinanceAuthMiddleware");
const createExpense = require("../../controllers/expense/create");
const editExpense = require("../../controllers/expense/edit");
const deleteExpense = require("../../controllers/expense/delete");

// Define the route for creating data for an admin
router.post("/", ExpenseAuth, createExpense);
router.put("/:id", ExpenseAuth, editExpense);
router.delete("/:id", ExpenseAuth, deleteExpense);

module.exports = router;
