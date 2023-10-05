const updateDashboard = require("../../../service/credit/dashboard/updateDashboard");
const updateDashboardBranchInfo = require("../../../service/credit/dashboard/updateDashboardBranchInfo");
const getSingleDocFromCollection = require("../../../service/utils/getSingleDocFromCollection");
const updateOrCreateFieldsInDocument = require("../../../service/utils/updateOrCreateFieldsInDocument");
const updateSheetStatus = require("../../../service/utils/updateSheetStatus");
const updateTable = require("../../../service/utils/updateTable");
const admin = require("../../../config/firebase-admin"); // Import admin here

/**
 * Handles the creation of a Wifi report and related operations.
 *
 * @param {Object} req - Express.js request object containing the wifi data in the body.
 * @param {Object} res - Express.js response object.
 * @returns {Object} JSON response indicating success or failure.
 */
const WifiAssigned = async (req, res) => {
  try {
    // Create Firestore database and batch from admin
    const db = admin.firestore();
    const batch = db.batch();

    // Extracting data from the request body and adding a timestamp
    const data = req.body;
    if (!data) {
      return res.status(400).json({
        message:
          "Request body is missing or empty.Please refresh your browser and try again.",
      });
    }
    // Logging the received data
    // console.log(data);

    // Updating various tables with wifi information

    await updateOrCreateFieldsInDocument(db, batch, "Wifi", data.id, {
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
          wifiCollect: 1,
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
          wifiCollect: 1,
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
          wifiCollect: 1,
        },
        batch
      );

      // Getting wifi information from the prices collection
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
          wifiCollect: DeliveryGuyGain.wifi_collect_price,
          total: DeliveryGuyGain.wifi_collect_price,
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
          newSalaryExpense.total.total + DeliveryGuyGain.wifi_collect_price
        );
        if (newStatus) {
          // Commit the batch updates

          // Update the dashboard with the new status
          await updateDashboard(
            db,
            batch,
            data.branchId,
            newStatus.totalExpense
          );
          // Update dashboard branch info with the new status
          await updateDashboardBranchInfo(
            db,
            batch,
            data.branchId,
            newStatus.totalExpense
          );
        }
      }
    }
    await batch.commit();
    // Responding with a success message
    res.status(200).json({ message: `Wifi Assigned successfully.` });
  } catch (error) {
    // Handling and logging any errors
    console.error(error);
    // Responding with an error message
    res.status(500).json({ message: error.message });
  }
};

module.exports = WifiAssigned;
