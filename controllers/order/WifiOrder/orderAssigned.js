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

    // Updating various tables with wifi information

    await updateOrCreateFieldsInDocument(db, batch, "Wifi", data.id, {
      status: "Assigned",
    });
    // First update: Change the daily table

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

const originalObject = {
  date: { _seconds: 1698573289, _nanoseconds: 490000000 },
  branchId: "qgXMsBtZ6f3hVe0S2m4g",
  wifi: 100,
  wifiAccount: "no wifi account",
  totalDeliveryGuySalary: 0,
  ethioTelAccount: "no ethio Tel Account",
  houseRent: 100,
  ethioTelOwnerName: "no ethio tele phone owner name",
  totalStaffSalary: 3300,
  totaltax: 0,
  taxPersentage: 12,
  totalIncome: 0,
  createdDate: "October 29, 2023",
  ethioTelBill: 100,
  wifiOwnerName: "no wifi owner name",
  houseRentOwnerName: "no house owner name",
  totalExpense: 3600,
  houseRentAccount: "no house rent account",
};
