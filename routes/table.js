// Import required modules
const express = require("express");
const TableAuth = require("../middlewares/adminAuth");
const tableController = require("../controllers/Table");

// Create a new router for sheets
const router = express.Router();

// Create a route for creating a new sheet
router.post("/", TableAuth, tableController.createTable);
router.post("/summery", TableAuth, tableController.createSummeryTable);
router.post("/holiday", TableAuth, tableController.addHoliday);
router.delete(
  "/delete/:id/:active/:fieldName/:sheetId",
  TableAuth,
  tableController.DeleteTable
);
router.post("/salary", TableAuth, tableController.createSalaryTable);
router.post("/calculator", TableAuth, tableController.createCalculator);
router.put("/setCalculator/:id", TableAuth, tableController.updateCalculator);
// Export the router
module.exports = router;
