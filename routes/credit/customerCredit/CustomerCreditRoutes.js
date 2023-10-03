// Import required modules
const express = require("express");
const router = express.Router();
const CustomerCreditAuth = require("../../../middlewares/IndivitualAuth/AdminAuthMiddleware");
const createCredit = require("../../../controllers/credit/customerCredit/create");
const editCredit = require("../../../controllers/credit/customerCredit/edit");
const deleteCredit = require("../../../controllers/credit/customerCredit/delete");

// Define the route for creating data for an admin
router.post("/", CustomerCreditAuth, createCredit);
router.put("/:creditId", CustomerCreditAuth, editCredit);
router.delete("/:creditId", CustomerCreditAuth, deleteCredit);

module.exports = router;
