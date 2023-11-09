// Import required modules
const express = require("express");
const router = express.Router();
const HolidayBonusAuth = require("../../../middlewares/IndivitualAuth/AdminAuthMiddleware");
const DeliveryGuyHolidayBonus = require("../../../controllers/incentive/bonus/holidayBonus/daliveryGuyHolidayBonus/create");
const AllStaffBonus = require("../../../controllers/incentive/bonus/holidayBonus/staffHolidayBonus/allStaff");
const BonusToIndividualStaff = require("../../../controllers/incentive/bonus/holidayBonus/staffHolidayBonus/individualStaff");
const checkRequestBodyMiddleware = require("../../../middlewares/checkRequestBodyMiddleware");

// Define the route for creating data for an admin
router.post(
  "/deliveryGuy",
  checkRequestBodyMiddleware,
  HolidayBonusAuth,
  DeliveryGuyHolidayBonus
);
router.post(
  "/staff",
  HolidayBonusAuth,
  checkRequestBodyMiddleware,
  AllStaffBonus
);
router.post(
  "/individual",
  HolidayBonusAuth,
  checkRequestBodyMiddleware,
  BonusToIndividualStaff
);

module.exports = router;
