const admin = require("../../../config/firebase-admin");
const editDocument = require("../../../service/mainCRUD/editDoc");
const createOrUpdateDocument = require("../../../service/order/createOrUpdateDocument");
const createCustomerData = require("../../../util/createCustomerData");
const generateCustomID = require("../../../util/generateCustomID");

/**
 * Edit a Water Order document in the "Water Order" Firestore collection.
 *
 * @param {Object} db - The Firestore database instance.
 * @param {Object} batch - The Firestore batch instance.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void}
 */
const editWaterOrder = async (req, res) => {
  const db = admin.firestore();
  const batch = db.batch();
  try {
    // Get document ID and updated data from the request body
    const updatedData = req.body;
    const { id } = req.params;

    updatedData.status = "Assigned";

    updatedData.createdAt = admin.firestore.FieldValue.serverTimestamp();

    // Edit the Water Order document in the "Water Order" collection

    await editDocument(db, batch, "Water", id, updatedData); // Updated function call

    const customerData = createCustomerData(updatedData, "Water");

    const Id = generateCustomID(`${updatedData.blockHouse}`);

    await createOrUpdateDocument(db, batch, "customer", Id, customerData); // Updated function call

    // Respond with a success message
    await batch.commit();
    res
      .status(200)
      .json({ message: "Water Order document edited successfully." });
  } catch (error) {
    // Handle any errors that occur during the operation
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = editWaterOrder;
