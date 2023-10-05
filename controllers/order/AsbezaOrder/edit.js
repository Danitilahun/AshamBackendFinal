const editDocument = require("../../../service/mainCRUD/editDoc");
const createOrUpdateDocument = require("../../../service/order/createOrUpdateDocument");
const sendFCMNotification = require("../../../service/order/sendFCMNotification");
const generateCustomID = require("../../../util/generateCustomID");
const admin = require("../../../config/firebase-admin");
const getDocumentDataById = require("../../../service/utils/getDocumentDataById");
const swapDeliveryManPositions = require("../../../service/users/deliveryGuyActiveness/swapDeliveryManPositions");

/**
 * Edit an Asbeza Order document in the "Asbeza Order" Firestore collection.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void}
 */

const editAsbezaOrder = async (req, res) => {
  try {
    const db = admin.firestore(); // Create a Firestore database instance
    const batch = db.batch(); // Create a Firestore batch instance

    // Get document ID and updated updatedData from the request body
    const updatedData = req.body;
    const { id } = req.params;

    if (!updatedData || !id) {
      return res.status(400).json({
        message:
          "Request body is missing or empty.Please refresh your browser and try again.",
      });
    }

    // Edit the Asbeza Order document in the "Asbeza Order" collection
    await editDocument(db, batch, "Asbeza", id, updatedData); // Updated function call
    const customerData = {
      name: updatedData.name,
      phone: updatedData.phone,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      blockHouse: updatedData.blockHouse,
      branchId: updatedData.branchId,
      branchName: updatedData.branchName,
      createdDate: updatedData.createdDate,
      type: "Asbeza",
    };

    const Id = generateCustomID(`${updatedData.blockHouse}`);
    await createOrUpdateDocument(db, batch, "customer", Id, customerData); // Updated function call

    // Commit the batch to execute all operations together
    await batch.commit();

    // Respond with a success message
    res
      .status(200)
      .json({ message: "Asbeza Order document edited successfully." });
  } catch (error) {
    // Handle any errors that occur during the operation
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = editAsbezaOrder;
