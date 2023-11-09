// Import required modules
const express = require("express");
const router = express.Router();
const CalculatorMiddleware = require("../../middlewares/JoinedAuth/FinanceAdminJoinedAuth");
const updateCalculator = require("../../controllers/calculator/updateCalculator");
const validateIdParam = require("../../middlewares/validateIdParam");

// Define the route for creating data for an admin

router.put("/:id", CalculatorMiddleware, validateIdParam, updateCalculator);

// Export the router
module.exports = router;
