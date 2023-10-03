const express = require("express");
const router = express.Router();
const BonusRoutes = require("./bonus/bonus");
const PenalityRoutes = require("./penality/penality");
const HolidayBonusRoutes = require("./bonus/holidayBonus");
// Use sub-routes under "/api/credit"

router.use("/bonus", BonusRoutes);
router.use("/holidayBonus", HolidayBonusRoutes);
router.use("/penality", PenalityRoutes);

module.exports = router;
