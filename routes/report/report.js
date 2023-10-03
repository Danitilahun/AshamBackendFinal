const express = require("express");
const router = express.Router();
const CardFee = require("./cardFeeReport/cardFeeReport");
const CardDistribute = require("./cardDistributeReport/cardDistributeReport");
const WaterDistribute = require("./waterReport/waterReport");
const WifiDistribute = require("./wifiReport/wifiReport");
const HotelProfit = require("./hotelReport/hotelReport");
const AsbezaProfit = require("./asbezaReport/asbezaReport");
// Use sub-routes under "/api/credit"

router.use("/CardFee", CardFee);
router.use("/cardDistribute", CardDistribute);
router.use("/waterDistribute", WaterDistribute);
router.use("/wifiDistribute", WifiDistribute);
router.use("/hotelProfit", HotelProfit);
router.use("/asbezaProfit", AsbezaProfit);

module.exports = router;
