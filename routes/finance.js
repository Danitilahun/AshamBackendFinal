// Import required modules
const express = require("express");
const router = express.Router();
const financeController = require("../controllers/finance");
const authMiddleware = require("../middlewares/auth");

// Define the route for creating data for an admin
router.post("/", authMiddleware, financeController.createFinance);

// Define the route for updating data for an admin
router.put("/:id", authMiddleware, financeController.updateFinance);
router.put(
  "/profileImage/:id",
  authMiddleware,
  financeController.updateProfilePicture
);
// Define the route for deleting data for an admin
router.delete("/:id", authMiddleware, financeController.deleteFinance);

// Export the router
module.exports = router;
