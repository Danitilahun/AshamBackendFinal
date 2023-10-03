const express = require("express");
const router = express.Router();
const CustomerCreditRoutes = require("./customerCredit/CustomerCreditRoutes");
const DailyCreditRoutes = require("./dailyCredit/dailyCreditRoutes");
const StaffCreditRoutes = require("./staffCredit/staffCreditRoutes");
const FinanceCreditRoutes = require("./financeCredit/financeCredit");
// Use sub-routes under "/api/credit"

router.use("/CustomerCredit", CustomerCreditRoutes);
router.use("/DailyCredit", DailyCreditRoutes);
router.use("/StaffCredit", StaffCreditRoutes);
router.use("/financeCredit", FinanceCreditRoutes);

module.exports = router;
