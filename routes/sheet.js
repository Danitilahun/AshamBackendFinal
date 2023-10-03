// Import required modules
const express = require("express");
const sheetAuth = require("../middlewares/adminAuth");
const sheetController = require("../controllers/Sheet");

// Create a new router for sheets
const router = express.Router();

// Create a route for creating a new sheet
router.post("/", sheetAuth, sheetController.Createsheet);
// Create a route for deleting an existing sheet
router.delete("/:id", sheetAuth, sheetController.deletesheet);

// Export the router
module.exports = router;
