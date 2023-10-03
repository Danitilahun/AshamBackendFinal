// Import required modules
const express = require("express");
const router = express.Router();
const SuperAdminMiddleware = require("../../../middlewares/IndivitualAuth/SuperAdminMiddleware");
const createCallCenterData = require("../../../controllers/users/callCenter/create");
const editCallCenter = require("../../../controllers/users/callCenter/edit");

// Define the route for creating data for an admin
router.post("/", SuperAdminMiddleware, createCallCenterData);
router.put("/:id", SuperAdminMiddleware, editCallCenter);

// Export the router
module.exports = router;
