// Import required modules
const express = require("express");
const router = express.Router();
const HolidayBonusAuth = require("../../../middlewares/IndivitualAuth/AdminAuthMiddleware");
const DeliveryGuyHolidayBonus = require("../../../controllers/incentive/bonus/holidayBonus/daliveryGuyHolidayBonus/create");
const AllStaffBonus = require("../../../controllers/incentive/bonus/holidayBonus/staffHolidayBonus/allStaff");
const BonusToIndividualStaff = require("../../../controllers/incentive/bonus/holidayBonus/staffHolidayBonus/individualStaff");

// Define the route for creating data for an admin
router.post("/deliveryGuy", HolidayBonusAuth, DeliveryGuyHolidayBonus);
router.post("/staff", HolidayBonusAuth, AllStaffBonus);
router.post("/individual", HolidayBonusAuth, BonusToIndividualStaff);

module.exports = router;
