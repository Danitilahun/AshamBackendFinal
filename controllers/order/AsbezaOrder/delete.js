const admin = require("../../../config/firebase-admin");
const updateFieldInDocument = require("../../../service/utils/updateFieldInDocument");
const deleteDocument = require("../../../service/mainCRUD/deleteDoc");
const getDocumentDataById = require("../../../service/utils/getDocumentDataById");
const generateCustomID = require("../../../util/generateCustomID");
const payAsbezaDeliveryGuy = require("../../../service/utils/AssignedPay/AsbezaPay");
const updateDeliveryGuyData = require("../../../service/utils/updateDeliveryGuyData");

/**
 * Delete an Asbeza Order document from the "Asbeza Order" Firestore collection.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void}
 */

const deleteAsbezaOrder = async (req, res) => {
  try {
    const db = admin.firestore(); // Create a Firestore database instance
    const batch = db.batch(); // Create a Firestore batch instance

    // Get document ID from the request parameters
    const { id, cn } = req.params;

    const AsbezaData = await getDocumentDataById("Asbeza", id); // Updated function call

    if (!AsbezaData) {
      return res.status(400).json({
        message: "This Asbeza Order does not exist.",
      });
    }

    await deleteDocument(db, batch, "Asbeza", id);

    const Id = generateCustomID(`${AsbezaData.blockHouse}`);

    await updateFieldInDocument(db, batch, "customer", Id, "Asbeza", "No"); // Updated function call

    if (cn === "pay") {
      await updateDeliveryGuyData(db, AsbezaData, batch);
      await payAsbezaDeliveryGuy(db, AsbezaData, batch, 1);
    }

    await batch.commit();
    // Respond with a success message
    res
      .status(200)
      .json({ message: "Asbeza Order document deleted successfully." });
  } catch (error) {
    // Handle any errors that occur during the operation
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = deleteAsbezaOrder;
