const admin = require("../../../config/firebase-admin");
const editDocument = require("../../../service/mainCRUD/editDoc");
const createOrUpdateDocument = require("../../../service/order/createOrUpdateDocument");
const generateCustomID = require("../../../util/generateCustomID");
const createCustomerData = require("../../../util/createCustomerData");

/**
 * Edit an Asbeza Order document in the "Asbeza Order" Firestore collection.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void}
 */

const editAsbezaOrder = async (req, res) => {
  try {
    const db = admin.firestore();
    const batch = db.batch();

    // Get document ID and updated updatedData from the request body
    const updatedData = req.body;

    const { id } = req.params;

    updatedData.status = "Assigned";

    updatedData.createdAt = admin.firestore.FieldValue.serverTimestamp();

    // Edit the Asbeza Order document in the "Asbeza Order" collection
    await editDocument(db, batch, "Asbeza", id, updatedData);

    const customerData = createCustomerData(updatedData, "Asbeza");

    const Id = generateCustomID(`${updatedData.blockHouse}`);

    await createOrUpdateDocument(db, batch, "customer", Id, customerData);

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
