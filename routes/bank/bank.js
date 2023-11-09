// Import required modules
const express = require("express");
const router = express.Router();
const BankAuth = require("../../middlewares/JoinedAuth/FinanceAdminJoinedAuth");
const CreateBank = require("../../controllers/bank/create");
const checkRequestBodyMiddleware = require("../../middlewares/checkRequestBodyMiddleware");

// Define the route for creating data for an admin
router.post("/", BankAuth, checkRequestBodyMiddleware, CreateBank);

module.exports = router;
