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

    if (!data) {
      return res
        .status(400)
        .json({ message: "Request body is missing or empty." });
    }

    // Updating various tables with cardFee information
    await updateOrCreateFieldsInDocument(db, batch, "Asbeza", data.id, {
      status: "Assigned",
    });

    // Commit the batch to execute all operations together
    await batch.commit();

    res.status(200).json({ message: `Asbeza Assigned successfully.` });
  } catch (error) {
    // Handling and logging any errors
    console.error(error);

    // Responding with an error message
    res.status(500).json({ message: error.message });
  }
};

module.exports = AsbezaAssigned;
