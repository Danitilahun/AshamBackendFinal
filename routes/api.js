const express = require("express");
const router = express.Router();
const userRoute = require("./users/user");
const CreditRoute = require("./credit/credit");
const ReportRoute = require("./report/report");
const IncentiveRoute = require("./incentive/incentive");
const BankRoute = require("./bank/bank");
const EssentialRoute = require("./essential/essential");
const OrderRoute = require("./order/order");
const ExpenseRoute = require("./expense/expense");
const BranchRoute = require("./branch/branch");
const CalculateRoute = require("./calculator/calculator");
const NotificationRoute = require("./notification/notification");
const DailyTableRoutes = require("./dailyTable/dailyTable");
const SheetRoute = require("./sheet/sheet");
const CalculatorRoute = require("./calculator/calculator");
const DashboardRoute = require("./dashboard/dashboard");
const ExportRoutes = require("./export/export");

// Use sub-routes under "/api"
router.use("/user", userRoute);
router.use("/credit", CreditRoute);
router.use("/report", ReportRoute);
router.use("/incentive", IncentiveRoute);
router.use("/bank", BankRoute);
router.use("/essential", EssentialRoute);
router.use("/expense", ExpenseRoute);
router.use("/order", OrderRoute);
router.use("/export", ExportRoutes);
router.use("/branch", BranchRoute);
router.use("/calculator", CalculateRoute);
router.use("/notification", NotificationRoute);
router.use("/table", DailyTableRoutes);
router.use("/sheet", SheetRoute);
router.use("/calculator", CalculatorRoute);
router.use("/dashboard", DashboardRoute);

module.exports = router;
