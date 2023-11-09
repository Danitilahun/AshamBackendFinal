// Import required modules
const express = require("express");
const router = express.Router();
const BranchAuth = require("../../middlewares/IndivitualAuth/SuperAdminMiddleware");
const SheetStatusAuth = require("../../middlewares/IndivitualAuth/FinanceAuthMiddleware");
const createBranch = require("../../controllers/branch/create");
const editBranch = require("../../controllers/branch/edit");
const deleteBranch = require("../../controllers/branch/delete");
const ChangeSheetStatus = require("../../controllers/branch/compeleteSheet");
const updateBranchName = require("../../controllers/branch/updateBranchName");
const validateIdParam = require("../../middlewares/validateIdParam");
const checkRequestBodyMiddleware = require("../../middlewares/checkRequestBodyMiddleware");

// Define the route for creating data for an admin
router.post("/", BranchAuth, checkRequestBodyMiddleware, createBranch);
router.post(
  "/changeSheetStatus",
  SheetStatusAuth,
  checkRequestBodyMiddleware,
  ChangeSheetStatus
);
router.put("/:id", validateIdParam, BranchAuth, editBranch);
router.put("/name/:id", BranchAuth, validateIdParam, updateBranchName);
router.delete("/:id", BranchAuth, validateIdParam, deleteBranch);

module.exports = router;
