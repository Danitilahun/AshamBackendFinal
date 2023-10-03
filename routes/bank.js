// Import required modules
const express = require("express");
const bankAuth = require("../middlewares/adminAuth");
const bankController = require("../controllers/bank");

// Create a new router for banks
const router = express.Router();

router.post("/", bankAuth, bankController.CreateBank);
router.put("/:id", bankAuth, bankController.EditBank);
// router.delete("/:id/:active", bankAuth, bankController.deleteBank);

// Export the router
module.exports = router;
