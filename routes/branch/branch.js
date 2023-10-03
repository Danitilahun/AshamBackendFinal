// Import required modules
const express = require("express");
const router = express.Router();
const BranchAuth = require("../../middlewares/IndivitualAuth/SuperAdminMiddleware");
const SheetStatusAuth = require("../../middlewares/IndivitualAuth/FinanceAuthMiddleware");
const createBranch = require("../../controllers/branch/create");
const editBranch = require("../../controllers/branch/edit");
const deleteBranch = require("../../controllers/branch/delete");
const ChangeSheetStatus = require("../../controllers/branch/compeleteSheet");

// Define the route for creating data for an admin
router.post("/", BranchAuth, createBranch);
router.post("/changeSheetStatus", SheetStatusAuth, ChangeSheetStatus);
router.put("/:id", BranchAuth, editBranch);
router.delete("/:id", BranchAuth, deleteBranch);

module.exports = router;
