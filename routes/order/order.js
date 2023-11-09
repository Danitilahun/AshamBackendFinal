const express = require("express");
const router = express.Router();
const asbezaRoutes = require("./asbeza/asbeza");
const cardRoutes = require("./card/card");
const wifiRoutes = require("./wifi/wifi");
const waterRoutes = require("./water/water");
const reminderRoutes = require("./reminder/reminder");

// Use sub-routes under "/api/credit"

router.use("/asbeza", asbezaRoutes);
router.use("/card", cardRoutes);
router.use("/wifi", wifiRoutes);
router.use("/water", waterRoutes);
router.use("/reminder", reminderRoutes);

module.exports = router;
