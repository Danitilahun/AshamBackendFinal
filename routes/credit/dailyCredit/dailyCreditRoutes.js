// Import required modules
const express = require("express");
const router = express.Router();
const DailyCreditAuth = require("../../../middlewares/IndivitualAuth/AdminAuthMiddleware");
const createCredit = require("../../../controllers/credit/DailyCredit/create");
const editCredit = require("../../../controllers/credit/DailyCredit/edit");
const deleteCredit = require("../../../controllers/credit/DailyCredit/delete");
const checkRequestBodyMiddleware = require("../../../middlewares/checkRequestBodyMiddleware");

// Define the route for creating data for an admin
router.post("/", DailyCreditAuth, checkRequestBodyMiddleware, createCredit);
router.put("/:creditId", DailyCreditAuth, editCredit);
router.delete("/:creditId", DailyCreditAuth, deleteCredit);

module.exports = router;
