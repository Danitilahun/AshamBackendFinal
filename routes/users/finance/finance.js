// Import required modules
const express = require("express");
const router = express.Router();
const SuperAdminMiddleware = require("../../../middlewares/IndivitualAuth/SuperAdminMiddleware");
const editFinance = require("../../../controllers/users/finance/edit");
const createFinance = require("../../../controllers/users/finance/create");

// Define the route for creating data for an admin
router.post("/", SuperAdminMiddleware, createFinance);
router.put("/:id", SuperAdminMiddleware, editFinance);

// Export the router
module.exports = router;
