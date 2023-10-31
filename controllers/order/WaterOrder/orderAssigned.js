// Importing necessary services and utilities
const admin = require("../../../config/firebase-admin");
const updateDashboard = require("../../../service/credit/dashboard/updateDashboard");
const updateDashboardBranchInfo = require("../../../service/credit/dashboard/updateDashboardBranchInfo");
const getSingleDocFromCollection = require("../../../service/utils/getSingleDocFromCollection");
const updateOrCreateFieldsInDocument = require("../../../service/utils/updateOrCreateFieldsInDocument");
const updateSheetStatus = require("../../../service/utils/updateSheetStatus");
const updateTable = require("../../../service/utils/updateTable");
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
      status: "Assigned",
    }); // Updated function call

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
