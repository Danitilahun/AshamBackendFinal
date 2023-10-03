// Import required modules
const express = require("express");
const router = express.Router();
const SheetCreateAuthMiddleware = require("../../middlewares/IndivitualAuth/AdminAuthMiddleware");
const SheetDeleteAuthMiddleware = require("../../middlewares/IndivitualAuth/SuperAdminMiddleware");
const createSheet = require("../../controllers/sheet/create");
const deleteSheet = require("../../controllers/sheet/delete");

// Define the route for creating data for an admin
router.post("/", SheetCreateAuthMiddleware, createSheet);
router.delete("/:id", SheetDeleteAuthMiddleware, deleteSheet);

// Export the router
module.exports = router;
