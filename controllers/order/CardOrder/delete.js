const deleteDocument = require("../../../service/mainCRUD/deleteDoc");
const updateDashboardTotalCustomer = require("../../../service/order/updateDashboardTotalCustomer");
const getDocumentDataById = require("../../../service/utils/getDocumentDataById");
const updateFieldInDocument = require("../../../service/utils/updateFieldInDocument");
const generateCustomID = require("../../../util/generateCustomID");
const admin = require("../../../config/firebase-admin");
const payCardDeliveryGuy = require("../../../service/utils/AssignedPay/CardPay");
const returnDeliveryGuyData = require("../../../service/utils/returnCardAssigned");

/**
 * Delete a Card Order document from the "CardOrder" Firestore collection.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void}
 */
const deleteCardOrder = async (req, res) => {
  const db = admin.firestore();
  const batch = db.batch(); // Create a Firestore batch

  try {
    // Get document ID from the request parameters
    const { id, cn } = req.params;

    if (!id) {
      return res.status(400).json({
        message:
          "Request parameters missing or empty.Please refresh your browser and try again.",
      });
    }

    const CardData = await getDocumentDataById("Card", id); // Updated function call
    if (!CardData) {
      return res.status(400).json({
        message: "Card Order document does not exist or is empty.",
      });
    }
    // Delete the Card Order document from the "Card Order" collection
    await deleteDocument(db, batch, "Card", id); // Updated function call
    const Id = generateCustomID(`${CardData.blockHouse}`);
    await updateFieldInDocument(db, batch, "customer", Id, "Card", "No"); // Updated function call
    // await updateDashboardTotalCustomer(-1);

    // Respond with a success message
    if (cn === "pay") {
      await payCardDeliveryGuy(db, CardData, batch, 1);
    } else {
      await returnDeliveryGuyData(db, CardData, batch);
    }
    // Commit the batch to execute all operations together
    await batch.commit();
    res
      .status(200)
      .json({ message: "Card Order document deleted successfully." });
  } catch (error) {
    // Handle any errors that occur during the operation
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = deleteCardOrder;
