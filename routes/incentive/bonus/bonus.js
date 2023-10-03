// Import required modules
const express = require("express");
const router = express.Router();
const BonusAuth = require("../../../middlewares/IndivitualAuth/AdminAuthMiddleware");
const createBonus = require("../../../controllers/incentive/bonus/create");
const editBonus = require("../../../controllers/incentive/bonus/edit");
const deleteBonus = require("../../../controllers/incentive/bonus/delete");

// Define the route for creating data for an admin
router.post("/", BonusAuth, createBonus);
router.put("/:bonusId", BonusAuth, editBonus);
router.delete("/:bonusId", BonusAuth, deleteBonus);

module.exports = router;
