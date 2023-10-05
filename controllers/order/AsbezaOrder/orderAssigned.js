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
 *
 * @param {Object} req - Express.js request object containing the credit data in the body.
 * @param {Object} res - Express.js response object.
 * @returns {Object} JSON response indicating success or failure.
 */
const AsbezaAssigned = async (req, res) => {
  try {
    const db = admin.firestore(); // Create a Firestore database instance
    const batch = db.batch(); // Create a Firestore batch instance

    // Extracting data from the request body and adding a timestamp
    const data = req.body;
    // Logging the received data
    console.log(data);

    if (!data) {
      return res
        .status(400)
        .json({ message: "Request body is missing or empty." });
    }

    // Updating various tables with cardFee information
    await updateOrCreateFieldsInDocument(db, batch, "Asbeza", data.id, {
      status: data.status,
    });

    if (data.status === "Assigned") {
      // First update: Change the daily table
      await updateTable(
        db,
        "tables",
        data.activeTable,
        data.deliveryguyId,
        "total",
        {
          asbezaNumber: 1,
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
          asbezaNumber: 1,
        },
        batch
      );

      // Third update: Individual person's daily work summery
      await updateTable(
        db,
        "tables",
        data.active,
        data.deliveryguyId,
        "total",
        {
          asbezaNumber: 1,
        },
        batch
      );

      // Getting cardFee information from the prices collection
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
          asbezaNumber: DeliveryGuyGain.asbezaPrice,
          total: DeliveryGuyGain.asbezaPrice,
        },
        batch
      );

      if (newSalaryExpense) {
        // Updating sheet status with totalDeliveryGuySalary
        const newStatus = await updateSheetStatus(
          db,
          batch,
          data.active,
          "totalDeliveryGuySalary",
          newSalaryExpense.total.total + DeliveryGuyGain.asbezaPrice
        );

        if (newStatus) {
          // Update the dashboard with the new status
          await updateDashboard(
            db,
            batch,
            data.branchId,
            newStatus.totalExpense ? newStatus.totalExpense : 0
          );

          // Update dashboard branch info with the new status
          await updateDashboardBranchInfo(
            db,
            batch,
            data.branchId,
            newStatus.totalExpense ? newStatus.totalExpense : 0
          );
        }
      }

      // Commit the batch to execute all operations together
      await batch.commit();
    }
    res.status(200).json({ message: `Asbeza Assigned successfully.` });
  } catch (error) {
    // Handling and logging any errors
    console.error(error);

    // Responding with an error message
    res.status(500).json({ message: error.message });
  }
};

module.exports = AsbezaAssigned;
