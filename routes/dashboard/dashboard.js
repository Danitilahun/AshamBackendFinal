const express = require("express");
const router = express.Router();
const DashboardAuth = require("../../middlewares/IndivitualAuth/SuperAdminMiddleware");
const dashBoardController = require("../../controllers/dashboard");

// Define the route for creating data for an admin
router.post("/", DashboardAuth, dashBoardController.createDashboard);
router.post("/branch", DashboardAuth, dashBoardController.createBranchData);

module.exports = router;
