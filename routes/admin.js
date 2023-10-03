// Import required modules
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const authMiddleware = require("../middlewares/auth");

// Define the route for creating data for an admin
router.post("/", authMiddleware, adminController.createAdminData);

// Define the route for updating data for an admin
router.put("/:id", authMiddleware, adminController.updateAdminData);
router.put("/disable/:id", authMiddleware, adminController.disableUser);
router.put(
  "/profileImage/:id",
  authMiddleware,
  adminController.updateProfilePicture
);

// Define the route for deleting data for an admin
router.delete(
  "/:id/:branchId",
  authMiddleware,
  adminController.deleteAdminData
);

// Export the router
module.exports = router;
