const express = require("express");
const router = express.Router();
const branchController = require("../controllers/branch");
const authMiddleware = require("../middlewares/auth");

// Define the route for creating data for an admin
router.post("/", authMiddleware, branchController.CreateBranch);

// Define the route for updating data for an admin
router.put("/:id", authMiddleware, branchController.updateBranch);
// // Define the route for deleting data for an admin
router.delete("/:id", authMiddleware, branchController.deleteBranch);
// Export the router
module.exports = router;
