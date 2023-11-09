const admin = require("../../../config/firebase-admin"); // Import admin here
const deleteDocument = require("../../../service/mainCRUD/deleteDoc");
const getDocumentDataById = require("../../../service/utils/getDocumentDataById");
const updateFieldInDocument = require("../../../service/utils/updateFieldInDocument");
const generateCustomID = require("../../../util/generateCustomID");
const payWifiDeliveryGuy = require("../../../service/utils/AssignedPay/WifiPay");
const updateDeliveryGuyData = require("../../../service/utils/wifiUpdate");

/**
 * Delete a Wifi Order document from the "Wifi Order" Firestore collection.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void}
 */
const deleteWifiOrder = async (req, res) => {
  try {
    // Create Firestore database and batch from admin
    const db = admin.firestore();
    const batch = db.batch();

    // Get document ID from the request parameters
    const { id, cn } = req.params;

    const WifiData = await getDocumentDataById("Wifi", id); // Updated function call
    if (!WifiData) {
      return res.status(400).json({
        message: "Wifi order does not eist",
      });
    }

    // Delete the Wifi Order document from the "Wifi Order" collection
    await deleteDocument(db, batch, "Wifi", id); // Updated function call

    const Id = generateCustomID(`${WifiData.blockHouse}`);

    await updateFieldInDocument(db, batch, "customer", Id, "Wifi", "No"); // Updated function call

    if (cn === "pay") {
      await updateDeliveryGuyData(db, WifiData, batch);
      await payWifiDeliveryGuy(db, WifiData, batch, 1);
    }
    await batch.commit();
    // Respond with a success message
    res
      .status(200)
      .json({ message: "Wifi Order document deleted successfully." });
  } catch (error) {
    // Handle any errors that occur during the operation
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = deleteWifiOrder;
