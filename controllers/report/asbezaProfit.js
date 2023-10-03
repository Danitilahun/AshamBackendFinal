const createDocument = require("../../service/mainCRUD/createDoc");
const updateSheetStatus = require("../../service/utils/updateSheetStatus");
const updateTable = require("../../service/utils/updateTable");
const updateCalculator = require("../../service/credit/updateCalculator/updateCalculator");
const updateDeliveryGuy = require("../../service/credit/updateDeliveryGuy/updateDeliveryGuy");
const updateCreditDocument = require("../../service/credit/totalCredit/updateCreditDocument");
const updateDashboard = require("../../service/report/updateDashBoard/AsbezaProfit/updateDashboard");
const updateDashboardBranchInfo = require("../../service/report/updateDashBoard/AsbezaProfit/updateDashboardBranchInfo");
const getSingleDocFromCollection = require("../../service/utils/getSingleDocFromCollection");
const updateDashboardAndBranchInfo = require("../../routes/report/asbezaReport/helper");
const updateCalculatorAmount = require("../../service/utils/updateCalculatorAmount");
const getDocumentDataById = require("../../service/utils/getDocumentDataById");
const admin = require("../../config/firebase-admin"); // Import admin here
const updateDocumentStatus = require("../../service/order/updateDocumentStatus");

/**
 * Handles the creation of an Asbeza Profit report and related operations.
 *
 * @param {Object} req - Express.js request object containing the Asbeza Profit data in the body.
 * @param {Object} res - Express.js response object.
 * @returns {Object} JSON response indicating success or failure.
 */
const AsbezaProfitReport = async (req, res) => {
  try {
    // Create Firestore database and batch from admin
    const db = admin.firestore();
    const batch = db.batch();

    // Extracting data from the request body and adding a timestamp
    const data = req.body;
    // Logging the received data
    console.log(data);

    // Check if 'data' object or 'data.id' is null
    if (!data || !data.id) {
      return res
        .status(400)
        .json({ message: "Invalid request data", type: "error" });
    }

    const Asbeza = await getDocumentDataById("Asbeza", data.id);
    if (!Asbeza) {
      return res
        .status(404)
        .json({ message: "Asbeza not found", type: "info" });
    }
    await updateDocumentStatus(db, batch, "Asbeza", data.id, "Completed");

    if (Asbeza.status === "Completed") {
      return res.status(404).json({
        message: "Asbeza is already completed",
        type: "info",
      });
    }

    const companyGain = await getSingleDocFromCollection("companyGain");
    if (!companyGain) {
      return res.status(404).json({
        message: "Company gain not found",
        type: "info",
      });
    }
    // First update: Change the daily table
    await updateTable(
      db,
      "tables",
      data.activeTable,
      data.deliveryguyId,
      "total",
      {
        asbezaProfit: companyGain.asbeza_profit,
        total: companyGain.asbeza_profit,
      },
      batch
    );

    // Second update: Change the 15 days summery and daily summery tables
    await updateTable(
      db,
      "tables",
      data.activeDailySummery,
      data.date,
      "total",
      {
        asbezaProfit: companyGain.asbeza_profit,
        total: companyGain.asbeza_profit,
      },
      batch
    );

    // Third update: Individual person's daily work summery
    const newIncome = await updateTable(
      db,
      "tables",
      data.active,
      data.deliveryguyId,
      "total",
      {
        asbezaProfit: companyGain.asbeza_profit,
        total: companyGain.asbeza_profit,
      },
      batch
    );

    // Check if 'newIncome' is null
    if (!newIncome) {
      return res.status(500).json({
        message: "Failed to update income",
        type: "error",
      });
    }
    console.log(newIncome);
    // Getting cardFee information from the prices collection

    // Updating sheet status with totalDeliveryGuySalary
    const newStatus = await updateSheetStatus(
      db,
      batch,
      data.active,
      "totalIncome",
      newIncome.total.total + companyGain.asbeza_profit
    );

    // Check if 'newStatus' is null
    if (!newStatus) {
      return res.status(500).json({
        message: "Failed to update sheet status",
        type: "error",
      });
    }

    // Update the dashboard with the new status
    // Updating dashboard with newIncome and newSalaryExpense details
    await updateDashboard(
      db,
      batch,
      data.branchId,
      newStatus.totalIncome,
      newStatus.totalExpense,
      parseFloat(companyGain.asbeza_profit)
    );

    // Updating dashboard branch information
    await updateDashboardBranchInfo(
      db,
      batch,
      data.branchId,
      newStatus.totalIncome,
      newStatus.totalExpense,
      newIncome.total.asbezaProfit + parseFloat(companyGain.asbeza_profit)
    );

    await updateCalculatorAmount(db, batch, data.active, newStatus.totalIncome);

    // Commit the batch updates
    await batch.commit();

    // Responding with a success message
    res
      .status(200)
      .json({ message: `Asbeza Profit Report Created successfully.` });
  } catch (error) {
    // Handling and logging any errors
    console.error(error);

    // Responding with an error message
    res.status(500).json({ message: error.message });
  }
};

module.exports = AsbezaProfitReport;
