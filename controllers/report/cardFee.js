const createDocument = require("../../service/mainCRUD/createDoc");
const getSingleDocFromCollection = require("../../service/utils/getSingleDocFromCollection");
const updateSheetStatus = require("../../service/utils/updateSheetStatus");
const updateTable = require("../../service/utils/updateTable");
const updateCalculator = require("../../service/credit/updateCalculator/updateCalculator");
const updateDeliveryGuy = require("../../service/credit/updateDeliveryGuy/updateDeliveryGuy");
const updateCreditDocument = require("../../service/credit/totalCredit/updateCreditDocument");
const createDocumentWithCustomId = require("../../service/mainCRUD/createDocumentWithCustomId");
const updateDashboard = require("../../service/credit/dashboard/updateDashboard");
const updateDashboardBranchInfo = require("../../service/credit/dashboard/updateDashboardBranchInfo");
const generateCustomID = require("../../utils/generateCustomID");
const admin = require("../../config/firebase-admin"); // Import admin here
const updateCalculatorAmount = require("../../service/utils/updateCalculatorAmount");
const updateCalculatorActual = require("../../service/utils/updateCalculatorActual");

/**
 * Handles the creation of a CardFee report and related operations.
 *
 * @param {Object} req - Express.js request object containing the credit data in the body.
 * @param {Object} res - Express.js response object.
 * @returns {Object} JSON response indicating success or failure.
 */
const CardFeeReport = async (req, res) => {
  try {
    // Create Firestore database and batch from admin
    const db = admin.firestore();
    const batch = db.batch();

    // Extracting data from the request body and adding a timestamp
    const data = req.body;

    if (!data || !data.branchId || !data.active || !data.deliveryguyId) {
      return res.status(400).json({
        message:
          "Request body is missing or empty.Please refresh your browser and try again.",
      });
    }

    // Logging the received data
    data.amount = data.price;
    data.total = data.price;
    data.gain = data.price;
    data.reason = "cardFee";
    data.CHECK_SOURCE = generateCustomID("cardFee_Report_Reason");
    data.source = "Report";
    // Creating a new credit document in the "CardFee" collection
    const id = await createDocument("CardFee", data, db, batch);
    await createDocumentWithCustomId("DailyCredit", id, data, db, batch);
    // Update the total credit and retrieve the updated total
    await updateDeliveryGuy(
      db,
      batch,
      data.deliveryguyId,
      "dailyCredit",
      parseFloat(data.price)
    );

    const DeliveryGuyGain = await getSingleDocFromCollection("prices");

    if (!DeliveryGuyGain) {
      return res.status(400).json({
        message:
          "Prices information is missing.Please refresh your browser and try again.",
      });
    }
    const newSalaryExpense = await updateTable(
      db,
      "salary",
      data.active,
      data.deliveryguyId,
      "total",
      {
        cardFee: DeliveryGuyGain.card_fee_price,
        total: DeliveryGuyGain.card_fee_price,
      },
      batch
    );

    if (!newSalaryExpense) {
      return res.status(500).json({
        message: "Failed to update sheet salary table.",
        type: "error",
      });
    }

    const newStatus = await updateSheetStatus(
      db,
      batch,
      data.active,
      "totalDeliveryGuySalary",
      newSalaryExpense.total.total + DeliveryGuyGain.card_fee_price
    );

    if (newStatus) {
      await updateDashboard(db, batch, data.branchId, newStatus.totalExpense);

      // Update dashboard branch info with the new status

      await updateDashboardBranchInfo(
        db,
        batch,
        data.branchId,
        newStatus.totalExpense
      );
    }

    const newTotalCredit = await updateCreditDocument(
      data.branchId,
      "DailyCredit",
      parseFloat(data.price ? data.price : 0),
      db,
      batch
    );

    // Update the calculator with the new total credit
    if (newTotalCredit && newTotalCredit?.total) {
      await updateCalculator(data.active, newTotalCredit?.total, db, batch);
    }

    // Commit the batch updates
    await batch.commit();

    // Responding with a success message
    res.status(200).json({ message: `CardFee Report Created successfully.` });
  } catch (error) {
    // Handling and logging any errors
    console.error(error);

    // Responding with an error message
    res.status(500).json({ message: error.message });
  }
};

module.exports = CardFeeReport;
