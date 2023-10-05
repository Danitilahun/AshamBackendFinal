const createDocument = require("../../service/mainCRUD/createDoc");
const getSingleDocFromCollection = require("../../service/utils/getSingleDocFromCollection");
const updateSheetStatus = require("../../service/utils/updateSheetStatus");
const updateTable = require("../../service/utils/updateTable");
const updateCalculator = require("../../service/credit/updateCalculator/updateCalculator");
const updateDeliveryGuy = require("../../service/credit/updateDeliveryGuy/updateDeliveryGuy");
const updateCreditDocument = require("../../service/credit/totalCredit/updateCreditDocument");
const createDocumentWithCustomId = require("../../service/mainCRUD/createDocumentWithCustomId");
const generateCustomID = require("../../utils/generateCustomID");
const admin = require("../../config/firebase-admin"); // Import admin here
const updateDashboard = require("../../service/credit/dashboard/updateDashboard");
const updateDashboardBranchInfo = require("../../service/credit/dashboard/updateDashboardBranchInfo");

/**
 * Handles the creation of a CardFee report and related operations.
 *
 * @param {Object} req - Express.js request object containing the credit data in the body.
 * @param {Object} res - Express.js response object.
 * @returns {Object} JSON response indicating success or failure.
 */
const WifiDistributeReport = async (req, res) => {
  try {
    // Create Firestore database and batch from admin
    const db = admin.firestore();
    const batch = db.batch();

    // Extracting data from the request body and adding a timestamp
    const data = req.body;
    // Logging the received data
    console.log(data);
    if (!data) {
      return res.status(400).json({
        message:
          "Request body is missing or empty.Please refresh your browser and try again.",
      });
    }
    const companyGain = await getSingleDocFromCollection("companyGain");
    if (!companyGain) {
      return res.status(404).json({
        message: "Company gain not found",
        type: "info",
      });
    }
    data.amount = data.numberOfCard * companyGain.wifi_distribute_gain;
    data.reason = "wifiDistribute";
    data.CHECK_SOURCE = generateCustomID("wifiDistribute_Report_Reason");
    data.source = "Report";
    // Creating a new credit document in the "CardFee" collection
    const id = await createDocument("wifiDistribute", data, db, batch);
    await createDocumentWithCustomId("DailyCredit", id, data, db, batch);
    // Update the total credit and retrieve the updated total
    await updateDeliveryGuy(
      db,
      batch,
      data.deliveryguyId,
      "dailyCredit",
      parseInt(data.numberOfCard * companyGain.wifi_distribute_gain)
    );
    // Commit the batch updates

    // Updating various tables with cardFee information

    const DeliveryGuyGain = await getSingleDocFromCollection("prices");

    if (!DeliveryGuyGain) {
      return res.status(400).json({
        message:
          "Prices information is missing.Please refresh your browser and try again.",
      });
    }
    // Fourth update: Salary of the delivery guy table
    const newSalaryExpense = await updateTable(
      db,
      "salary",
      data.active,
      data.deliveryguyId,
      "total",
      {
        wifiDistribute:
          data.numberOfCard * DeliveryGuyGain.wifi_distribute_price,
        total: data.numberOfCard * DeliveryGuyGain.wifi_distribute_price,
      },
      batch
    );

    if (!newSalaryExpense) {
      return res.status(500).json({
        message: "Failed to update sheet salary table.",
        type: "error",
      });
    }
    // Updating sheet status with totalDeliveryGuySalary

    const newStatus = await updateSheetStatus(
      db,
      batch,
      data.active,
      "totalDeliveryGuySalary",
      newSalaryExpense.total.total +
        data.numberOfCard * DeliveryGuyGain.wifi_distribute_price
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
    // Updating dashboard branch information
    await batch.commit();
    // Responding with a success message
    res
      .status(200)
      .json({ message: `Wifi Distribute Report Created successfully.` });
  } catch (error) {
    // Handling and logging any errors
    console.error(error);

    // Responding with an error message
    res.status(500).json({ message: error.message });
  }
};

module.exports = WifiDistributeReport;
