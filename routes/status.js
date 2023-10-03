// Import required modules
const express = require("express");
const statusAuth = require("../middlewares/adminAuth");
const statusController = require("../controllers/status");

// Create a new router for statuss
const router = express.Router();

// Create a route for creating a new status
router.post("/", statusAuth, statusController.CreateStatus);
router.put("/:id", statusAuth, statusController.EditStatus);
// Create a route for deleting an existing status
router.delete("/:id/:active", statusAuth, statusController.deleteStatus);

// Export the router
module.exports = router;
