const express = require("express");
const router = express.Router();
const creditController = require("../controllers/credit");
const authMiddleware = require("../middlewares/adminAuth");

// Define the route for creating data for an admin
router.post("/", authMiddleware, creditController.createCredit);

// Define the route for updating data for an admin
router.put("/:id", authMiddleware, creditController.updateCredit);
router.put("/remove/:id", authMiddleware, creditController.RemoveCredit);
// // Define the route for deleting data for an admin
router.delete(
  "/:collection/:id",
  authMiddleware,
  creditController.deleteCredit
);
// Export the router
module.exports = router;
