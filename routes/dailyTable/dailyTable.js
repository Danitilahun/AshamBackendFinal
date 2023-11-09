// Import required modules
const express = require("express");
const router = express.Router();
const createTable = require("../../controllers/dailyTable/createDailyTable");
const TableCreateMiddleware = require("../../middlewares/IndivitualAuth/AdminAuthMiddleware");
const TableDeleteMiddleware = require("../../middlewares/IndivitualAuth/SuperAdminMiddleware");
const DeleteTable = require("../../controllers/dailyTable/deleteDailyTable");
const validateIdParam = require("../../middlewares/validateIdParam");
const checkRequestBodyMiddleware = require("../../middlewares/checkRequestBodyMiddleware");

// Define the route for creating data for an admin
router.post(
  "/",
  TableCreateMiddleware,
  checkRequestBodyMiddleware,
  createTable
);
router.delete("/:id", TableDeleteMiddleware, validateIdParam, DeleteTable);

// Export the router
module.exports = router;
