// Import required modules
const express = require("express");
const router = express.Router();
const StaffCreditAuth = require("../../../middlewares/IndivitualAuth/AdminAuthMiddleware");
const createCredit = require("../../../controllers/credit/staffCredit/create");
const editCredit = require("../../../controllers/credit/staffCredit/edit");
const deleteCredit = require("../../../controllers/credit/staffCredit/delete");

// Define the route for creating data for an admin
router.post("/", StaffCreditAuth, createCredit);
router.put("/:creditId", StaffCreditAuth, editCredit);
router.delete("/:creditId", StaffCreditAuth, deleteCredit);

module.exports = router;
