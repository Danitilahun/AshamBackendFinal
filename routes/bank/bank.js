// Import required modules
const express = require("express");
const router = express.Router();
const BankAuth = require("../../middlewares/JoinedAuth/FinanceAdminJoinedAuth");
const CreateBank = require("../../controllers/bank/create");

// Define the route for creating data for an admin
router.post("/", BankAuth, CreateBank);

module.exports = router;
