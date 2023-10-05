const deleteDocument = require("../../../service/mainCRUD/deleteDoc");
const updateDashboardTotalCustomer = require("../../../service/order/updateDashboardTotalCustomer");
const getDocumentDataById = require("../../../service/utils/getDocumentDataById");
const updateFieldInDocument = require("../../../service/utils/updateFieldInDocument");
const generateCustomID = require("../../../util/generateCustomID");
const admin = require("../../../config/firebase-admin");

/**
 * Delete a Water Order document from the "Water Order" Firestore collection.
 *
 * @param {Object} db - The Firestore database instance.
 * @param {Object} batch - The Firestore batch instance.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void}
 */
const deleteWaterOrder = async (req, res) => {
  const db = admin.firestore();
  const batch = db.batch();
  try {
    // Get document ID from the request parameters
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        message:
          "Request body is missing or empty.Please refresh your browser and try again.",
      });
    }
    const WaterData = await getDocumentDataById("Water", id); // Updated function call
    if (!WaterData) {
      return res.status(404).json({
        message: `Water Order document does not exist.`,
      });
    }
    // Delete the Water Order document from the "Water Order" collection
    await deleteDocument(db, batch, "Water", id); // Updated function call
    const Id = generateCustomID(`${WaterData.blockHouse}`);
    await updateFieldInDocument(db, batch, "customer", Id, "Water", "No"); // Updated function call
    // await updateDashboardTotalCustomer(-1);
    // Respond with a success message
    await batch.commit();
    res
      .status(200)
      .json({ message: "Water Order document deleted successfully." });
  } catch (error) {
    // Handle any errors that occur during the operation
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = deleteWaterOrder;
