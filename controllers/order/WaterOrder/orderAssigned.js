// Importing necessary services and utilities
const updateDashboard = require("../../../service/credit/dashboard/updateDashboard");
const updateDashboardBranchInfo = require("../../../service/credit/dashboard/updateDashboardBranchInfo");
const getSingleDocFromCollection = require("../../../service/utils/getSingleDocFromCollection");
const updateOrCreateFieldsInDocument = require("../../../service/utils/updateOrCreateFieldsInDocument");
const updateSheetStatus = require("../../../service/utils/updateSheetStatus");
const updateTable = require("../../../service/utils/updateTable");
const admin = require("../../../config/firebase-admin");
/**
 * Handles the creation of a CardFee report and related operations.
 * @param {Object} db - The Firestore database instance.
 * @param {Object} batch - The Firestore batch instance.
 * @param {Object} req - Express.js request object containing the credit data in the body.
 * @param {Object} res - Express.js response object.
 * @returns {Object} JSON response indicating success or failure.
 */
const WaterAssigned = async (req, res) => {
  const db = admin.firestore();
  const batch = db.batch();
  try {
    // Extracting data from the request body and adding a timestamp
    const data = req.body;
    // Logging the received data
    if (!data) {
      return res.status(400).json({
        message:
          "Request body is missing or empty.Please refresh your browser and try again.",
      });
    }
    console.log(data);
    await updateOrCreateFieldsInDocument(db, batch, "Water", data.id, {
      status: data.status,
    }); // Updated function call
    // Updating various tables with cardFee information
    if (data.status === "Assigned") {
      // First update: Change the daily table
      await updateTable(
        db,

        "tables",
        data.activeTable,
        data.deliveryguyId,
        "total",
        {
          waterCollect: 1,
        },
        batch
      ); // Updated function call

      // Second update: Change the 15 days summery and daily summery tables
      await updateTable(
        db,
        "tables",
        data.activeDailySummery,
        data.date,
        "total",
        {
          waterCollect: 1,
        },
        batch
      ); // Updated function call

      // Third update: Individual person's daily work summery
      await updateTable(
        db,
        "tables",
        data.active,
        data.deliveryguyId,
        "total",
        {
          waterCollect: 1,
        },
        batch
      ); // Updated function call

      // Getting cardFee information from the prices collection
      const DeliveryGuyGain = await getSingleDocFromCollection("prices"); // Updated function call

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
          waterCollect: DeliveryGuyGain.water_collect_price,
          total: DeliveryGuyGain.water_collect_price,
        },
        batch
      ); // Updated function call

      // Updating sheet status with totalDeliveryGuySalary
      const newStatus = await updateSheetStatus(
        db,
        batch,
        data.active,
        "totalDeliveryGuySalary",
        newSalaryExpense.total.total + DeliveryGuyGain.water_collect_price
      ); // Updated function call

      // Update the dashboard with the new status
      await updateDashboard(db, batch, data.branchId, newStatus.totalExpense); // Updated function call

      // Update dashboard branch info with the new status
      await updateDashboardBranchInfo(
        db,
        batch,
        data.branchId,
        newStatus.totalExpense
      ); // Updated function call
    }

    await batch.commit();
    // Responding with a success message
    res.status(200).json({ message: `Water Assigned successfully.` });
  } catch (error) {
    // Handling and logging any errors
    console.error(error);

    // Responding with an error message
    res.status(500).json({ message: error.message });
  }
};

module.exports = WaterAssigned;
