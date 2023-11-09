const admin = require("../../../config/firebase-admin");
const deleteDocument = require("../../../service/mainCRUD/deleteDoc");
const getDocumentDataById = require("../../../service/utils/getDocumentDataById");
const updateFieldInDocument = require("../../../service/utils/updateFieldInDocument");
const generateCustomID = require("../../../util/generateCustomID");
const payWaterDeliveryGuy = require("../../../service/utils/AssignedPay/WaterPay");
const updateDeliveryGuyData = require("../../../service/utils/waterUpdate");

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
    const { id, cn } = req.params;

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

    // Respond with a success message
    if (cn === "pay") {
      await updateDeliveryGuyData(db, WaterData, batch);
      await payWaterDeliveryGuy(db, WaterData, batch, 1);
    }
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
