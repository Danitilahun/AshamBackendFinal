// Import required modules
const express = require("express");
const router = express.Router();
const callcenterController = require("../controllers/callcenter");
const authMiddleware = require("../middlewares/auth");

// Define the route for creating data for a call center
router.post("/", authMiddleware, callcenterController.createCallCenterData);

// Define the route for updating data for a call center
router.put("/:id", authMiddleware, callcenterController.updateCallCenterData);
router.put(
  "/profileImage/:id",
  authMiddleware,
  callcenterController.updateProfilePicture
);
// Define the route for deleting data for a call center
router.delete(
  "/:id",
  authMiddleware,
  callcenterController.deleteCallCenterData
);

// Export the router
module.exports = router;
