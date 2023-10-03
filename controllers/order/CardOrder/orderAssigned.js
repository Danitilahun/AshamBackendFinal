// Importing necessary services and utilities
const updateDashboard = require("../../../service/credit/dashboard/updateDashboard");
const updateDashboardBranchInfo = require("../../../service/credit/dashboard/updateDashboardBranchInfo");
const getSingleDocFromCollection = require("../../../service/utils/getSingleDocFromCollection");
const updateOrCreateFieldsInDocument = require("../../../service/utils/updateOrCreateFieldsInDocument");
const updateSheetStatus = require("../../../service/utils/updateSheetStatus");
const updateTable = require("../../../service/utils/updateTable");
const admin = require("../../../config/firebase-admin"); // Import the admin instance

/**
 * Handles the creation of a CardFee report and related operations.
 *
 * @param {Object} req - Express.js request object containing the credit data in the body.
 * @param {Object} res - Express.js response object.
 * @returns {Object} JSON response indicating success or failure.
 */

const CardAssigned = async (req, res) => {
  const db = admin.firestore();
  const batch = db.batch(); // Create a Firestore batch

  try {
    // Extracting data from the request body and adding a timestamp
    const data = req.body;
    // Logging the received data
    console.log(data);
    await updateOrCreateFieldsInDocument(db, batch, "Card", data.id, {
      // Updated function call
      status: data.status,
    });
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
          cardCollect: 1,
        },
        batch
      );

      // Second update: Change the 15 days summary and daily summary tables
      await updateTable(
        db,
        "tables",
        data.activeDailySummery,
        data.date,
        "total",
        {
          cardCollect: 1,
        },
        batch
      );

      // Third update: Individual person's daily work summary
      await updateTable(
        db,
        "tables",
        data.active,
        data.deliveryguyId,
        "total",
        {
          cardCollect: 1,
        },
        batch
      );

      // Getting cardFee information from the prices collection
      const DeliveryGuyGain = await getSingleDocFromCollection("prices"); // Updated function call

      // Fourth update: Salary of the delivery guy table
      const newSalaryExpense = await updateTable(
        db,
        "salary",
        data.active,
        data.deliveryguyId,
        "total",
        {
          cardCollect: DeliveryGuyGain.card_collect_price,
          total: DeliveryGuyGain.card_collect_price,
        },
        batch
      );

      // Updating sheet status with totalDeliveryGuySalary
      const newStatus = await updateSheetStatus(
        db,
        batch,
        data.active,
        "totalDeliveryGuySalary",
        newSalaryExpense.total.total + DeliveryGuyGain.card_collect_price
      );

      // Update the dashboard with the new status
      await updateDashboard(db, batch, data.branchId, newStatus.totalExpense);

      // Update dashboard branch info with the new status
      await updateDashboardBranchInfo(
        db,
        batch,
        data.branchId,
        newStatus.totalExpense
      );
    }
    // Responding with a success message
    // Commit the batch to execute all Firestore operations together
    await batch.commit();
    res.status(200).json({ message: `Card Order Assigned successfully.` });
  } catch (error) {
    // Handling and logging any errors
    console.error(error);

    // Responding with an error message
    res.status(500).json({ message: error.message });
  }
};

module.exports = CardAssigned;
