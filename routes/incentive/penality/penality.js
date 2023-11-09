// Import required modules
const express = require("express");
const router = express.Router();
const PenalityAuth = require("../../../middlewares/IndivitualAuth/AdminAuthMiddleware");
const createPenality = require("../../../controllers/incentive/penality/create");
const editPenality = require("../../../controllers/incentive/penality/edit");
const deletePenality = require("../../../controllers/incentive/penality/delete");
const checkRequestBodyMiddleware = require("../../../middlewares/checkRequestBodyMiddleware");

// Define the route for creating data for an admin
router.post("/", PenalityAuth, checkRequestBodyMiddleware, createPenality);
router.put("/:penalityId", PenalityAuth, editPenality);
router.delete("/:penalityId", PenalityAuth, deletePenality);

module.exports = router;
