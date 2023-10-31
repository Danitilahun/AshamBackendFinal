const updateFieldInDocument = require("../../../service/utils/updateFieldInDocument");
const admin = require("../../../config/firebase-admin");
const deleteDocument = require("../../../service/mainCRUD/deleteDoc");
const updateDashboardTotalCustomer = require("../../../service/order/updateDashboardTotalCustomer");
const getDocumentDataById = require("../../../service/utils/getDocumentDataById");
const generateCustomID = require("../../../util/generateCustomID");
const payDeliveryGuy = require("../../../service/utils/payForDeliveryGuyService");
const returnDeliveryGuyData = require("../../../service/utils/reverseDeliveryGuyData");
const payAsbezaDeliveryGuy = require("../../../service/utils/AssignedPay/AsbezaPay");

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

    if (!id) {
      return res.status(400).json({
        message:
          "Request body is missing or empty.Please refresh your browser and try again.",
      });
    }
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
      await payAsbezaDeliveryGuy(db, AsbezaData, batch, 1);
    } else {
      await returnDeliveryGuyData(db, AsbezaData, batch);
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
