const express = require("express");
const router = express.Router();
const DashboardAuth = require("../../middlewares/IndivitualAuth/SuperAdminMiddleware");
const dashBoardController = require("../../controllers/dashboard");
const checkRequestBodyMiddleware = require("../../middlewares/checkRequestBodyMiddleware");

// Define the route for creating data for an admin
router.post(
  "/",
  DashboardAuth,
  checkRequestBodyMiddleware,
  dashBoardController.createDashboard
);
router.post(
  "/branch",
  DashboardAuth,
  checkRequestBodyMiddleware,
  dashBoardController.createBranchData
);

module.exports = router;
