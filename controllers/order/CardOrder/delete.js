const admin = require("../../../config/firebase-admin");
const deleteDocument = require("../../../service/mainCRUD/deleteDoc");
const getDocumentDataById = require("../../../service/utils/getDocumentDataById");
const updateFieldInDocument = require("../../../service/utils/updateFieldInDocument");
const generateCustomID = require("../../../util/generateCustomID");
const payCardDeliveryGuy = require("../../../service/utils/AssignedPay/CardPay");
const updateDeliveryGuyData = require("../../../service/utils/cardUpdate");

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

    // Respond with a success message
    if (cn === "pay") {
      await updateDeliveryGuyData(db, CardData, batch);
      await payCardDeliveryGuy(db, CardData, batch, 1);
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
