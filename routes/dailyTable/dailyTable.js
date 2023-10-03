// Import required modules
const express = require("express");
const router = express.Router();
const createTable = require("../../controllers/dailyTable/createDailyTable");
const TableCreateMiddleware = require("../../middlewares/IndivitualAuth/AdminAuthMiddleware");
const TableDeleteMiddleware = require("../../middlewares/IndivitualAuth/SuperAdminMiddleware");
const DeleteTable = require("../../controllers/dailyTable/deleteDailyTable");

// Define the route for creating data for an admin
router.post("/", TableCreateMiddleware, createTable);
router.delete("/:id", TableDeleteMiddleware, DeleteTable);

// Export the router
module.exports = router;
