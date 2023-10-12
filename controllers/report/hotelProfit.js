const createDocument = require("../../service/mainCRUD/createDoc");
const updateDashboardBranchInfo = require("../../service/report/updateDashBoard/HotelProfit/updateDashboardBranchInfo");
const updateDashboard = require("../../service/report/updateDashBoard/HotelProfit/updateDashboard");
const updateSheetStatus = require("../../service/utils/updateSheetStatus");
const updateTable = require("../../service/utils/updateTable");
const updateCalculator = require("../../service/credit/updateCalculator/updateCalculator");
const updateDeliveryGuy = require("../../service/credit/updateDeliveryGuy/updateDeliveryGuy");
const updateCreditDocument = require("../../service/credit/totalCredit/updateCreditDocument");
const createDocumentWithCustomId = require("../../service/mainCRUD/createDocumentWithCustomId");
const generateCustomID = require("../../utils/generateCustomID");
const admin = require("../../config/firebase-admin"); // Import admin here

/**
 * Handles the creation of a CardFee report and related operations.
 *
 * @param {Object} req - Express.js request object containing the credit data in the body.
 * @param {Object} res - Express.js response object.
 * @returns {Object} JSON response indicating success or failure.
 */
const HotelProfitReport = async (req, res) => {
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
    console.log(data);
    data.reason = "hotelProfit";
    data.total = data.amount;
    data.gain = data.amount;
    data.CHECK_SOURCE = generateCustomID("hotelProfit_Report_Reason");
    data.source = "Report";
    // Creating a new credit document in the "CardFee" collection
    const id = await createDocument("hotelProfit", data, db, batch);
    await createDocumentWithCustomId("DailyCredit", id, data, db, batch);
    // Update the total credit and retrieve the updated total
    await updateDeliveryGuy(
      db,
      batch,
      data.deliveryguyId,
      "dailyCredit",
      parseInt(data.amount)
    );

    // Commit the batch updates
    await batch.commit();

    // Responding with a success message
    res
      .status(200)
      .json({ message: `Hotel Profit Report Created successfully.` });
  } catch (error) {
    // Handling and logging any errors
    console.error(error);

    // Responding with an error message
    res.status(500).json({ message: error.message });
  }
};

module.exports = HotelProfitReport;
